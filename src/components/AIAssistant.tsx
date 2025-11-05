"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Animations
import { Bot, X, Send, Settings2, RotateCcw } from "lucide-react";
import { ChatBubble } from "./chat/ChatBubble";

interface Message {
  role: "user" | "assistant" | "typing";
  content: string;
  id?: string; // For typing placeholder
}

/**
 * AI Assistant Component using Groq API
 * Instant conversation with streaming responses
 */
export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [animClass, setAnimClass] = useState("chat-bounce"); // CSS keyframe class for FAB
  
  const chatRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  // No retry timers; show a single clean error on failure
  const bounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const bounceResetRef = useRef<NodeJS.Timeout | null>(null);
  const lastPulseRef = useRef(false); // track pulse state when passing Experience
  const autoShownRef = useRef(false); // whether this session's auto-open is active
  const userOpenedRef = useRef(false); // true if user toggled open manually

  // Scroll-driven animation class swap: bounce (default) -> pulse near Experience
  useEffect(() => {
    if (typeof window === "undefined") return;
    let ticking = false;
    const getExperienceTop = (): number | null => {
      const byId = document.getElementById("experience");
      if (byId) return byId.getBoundingClientRect().top + window.scrollY;
      const byClass = document.querySelector('[class*="experience"]') as HTMLElement | null;
      if (byClass) return byClass.getBoundingClientRect().top + window.scrollY;
      return null;
    };
    const threshold = () => {
      const top = getExperienceTop();
      if (top == null) return null;
      return top - 120; // start pulsing slightly before section is fully reached
    };
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const th = threshold();
          if (th != null) {
            const reached = window.scrollY >= th;
            if (reached !== lastPulseRef.current) {
              lastPulseRef.current = reached;
              setAnimClass(reached ? "chat-pulse" : "chat-bounce");
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    // initial check
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Auto-open chat once per session, then auto-close on first scroll if user hasn't interacted
  useEffect(() => {
    if (typeof window === "undefined") return;
    // Skip if already shown in this session
    const already = window.sessionStorage.getItem("chatAutoShown");
    if (!already) {
      // Open after small delay to avoid jank
      const t = setTimeout(() => {
        setIsOpen(true);
        autoShownRef.current = true;
      }, 200);
      // Close on first scroll beyond threshold if still auto-opened
      const onScroll = () => {
        if (!autoShownRef.current) return;
        if (userOpenedRef.current) return; // user interacted, don't auto-close
        if (window.scrollY > 50) {
          setIsOpen(false);
          autoShownRef.current = false;
          window.sessionStorage.setItem("chatAutoShown", "true");
          window.removeEventListener("scroll", onScroll);
          clearTimeout(t as unknown as number);
        }
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => {
        window.removeEventListener("scroll", onScroll);
        clearTimeout(t as unknown as number);
      };
    }
  }, []);

  // Handle send message - instant UI update with streaming
  const handleSend = async () => {
    // 1) Read input and clear it
    const userMessage = input.trim();
    if (!userMessage) return;
    setInput("");

    // 2) Create newMessages including the user's latest message
    const newMessages = [...messages, { role: "user" as const, content: userMessage }];

    // Update state immediately so UI shows the user's message
    setMessages(newMessages);

    // Add typing placeholder immediately (append to new list)
    const typingId = `typing-${Date.now()}`;
    setMessages([...newMessages, { role: "typing", content: "", id: typingId }]);

    // Cancel any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      // 3) Build API payload from newMessages (avoids stale state)
      const apiMessages = newMessages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));

      // Call Groq API with streaming
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: apiMessages }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = errorData.error || "⚠️ AI is unavailable. Try again.";
        throw new Error(errorMsg);
      }

      // Keep typing placeholder visible until we start receiving content
      // Add assistant message placeholder immediately but keep typing indicator
      const assistantId = `assistant-${Date.now()}`;
      setMessages((prev) => [...prev, { role: "assistant", content: "", id: assistantId }]);

      // Stream the response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No response stream");
      }

      let accumulatedContent = "";
      let hasReceivedContent = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6).trim();
            if (data === "[DONE]") {
              // Remove typing indicator when done
              setMessages((prev) => prev.filter((m) => m.id !== typingId));
              break;
            }
            try {
              const parsed = JSON.parse(data);
              if (parsed.error) {
                // Handle error from stream
                setMessages((prev) => prev.filter((m) => m.id !== typingId && m.id !== assistantId));
                throw new Error(parsed.error);
              }
              if (parsed.content) {
                if (!hasReceivedContent) {
                  hasReceivedContent = true;
                  // Remove typing indicator once we receive first content
                  setMessages((prev) => prev.filter((m) => m.id !== typingId));
                }
                accumulatedContent += parsed.content;
                // 4) Update the LAST assistant message content (the one we just added)
                setMessages((prev) => {
                  const lastAssistantIndex = (() => {
                    for (let i = prev.length - 1; i >= 0; i--) {
                      if (prev[i].role === "assistant") return i;
                    }
                    return -1;
                  })();
                  if (lastAssistantIndex === -1) return prev;
                  const next = [...prev];
                  next[lastAssistantIndex] = { ...next[lastAssistantIndex], content: accumulatedContent } as any;
                  return next;
                });
              }
            } catch (e) {
              // Skip invalid JSON chunks
            }
          }
        }
      }

      // Ensure typing indicator is removed and finalize message
      setMessages((prev) => {
        const filtered = prev.filter((m) => m.id !== typingId);
        return filtered.map((m) =>
          m.id === assistantId
            ? { role: "assistant" as const, content: accumulatedContent || m.content }
            : m
        );
      });
    } catch (err: any) {
      // Remove typing placeholder
      setMessages((prev) => prev.filter((m) => m.id !== typingId));
      
      // Do NOT remove user messages or clear history - just append error message
      if (err.name !== "AbortError") {
        const errorMsg = err.message || "⚠️ AI is unavailable. Try again.";
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: errorMsg },
        ]);
      }
    } finally {
      abortControllerRef.current = null;
    }
  };

  // Show welcome message immediately when chat opens (only if no messages exist)
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content: "Hi! I'm Jacob's AI assistant. Ask me anything about his background, skills, projects, or tech interests!",
        },
      ]);
    }
  }, [isOpen, messages.length]);

  // Scroll to bottom smoothly when new messages arrive
  useEffect(() => {
    if (chatRef.current) {
      // Use requestAnimationFrame for smooth scrolling
      requestAnimationFrame(() => {
        if (chatRef.current) {
          chatRef.current.scrollTo({
            top: chatRef.current.scrollHeight,
            behavior: "smooth",
          });
        }
      });
    }
  }, [messages]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Reset chat
  const handleReset = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    // no retry timers to clear
    setMessages([
      {
        role: "assistant",
        content: "Hi! I'm Jacob's AI assistant. Ask me anything about his background, skills, projects, or tech interests!",
      },
    ]);
    setShowSettings(false);
  };

  // Handle enter key
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button - Premium orb */}
      <motion.button
        onClick={() => {
          setIsOpen(!isOpen);
          userOpenedRef.current = true; // mark manual interaction; prevents auto-close on scroll
        }}
        aria-label="Open AI Assistant"
        initial={{ scale: 0.95, opacity: 0.9 }}
        whileHover={{ scale: 1.05, boxShadow: "0 0 24px rgba(139,92,246,0.6), 0 0 48px rgba(0,207,255,0.4)" }}
        whileTap={{ scale: 0.98 }}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-md bg-gradient-to-br from-purple-500 to-cyan-500 shadow-lg overflow-visible group ${animClass}`}
        style={{ boxShadow: "0 0 18px rgba(139, 92, 246, 0.45), 0 0 36px rgba(0, 207, 255, 0.28)" }}
      >
        <motion.div
          className="absolute inset-0 rounded-full"
          // Keep halo; CSS animation handles main motion
          animate={{ boxShadow: [
            "0 0 0px rgba(139,92,246,0.0)",
            "0 0 18px rgba(139,92,246,0.28)",
            "0 0 0px rgba(139,92,246,0.0)"
          ] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          animate={{ rotate: [0, 8, -8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="relative"
        >
          <Bot className="w-6 h-6 text-white" />
        </motion.div>
      </motion.button>

      {/* Badge Text */}
      <div className="fixed bottom-20 right-6 z-50 text-xs text-muted-foreground text-right max-w-[140px]">
        AI-powered portfolio
      </div>

      {/* Chat Window - bottom-right widget */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed z-50 pointer-events-none"
            style={{ bottom: 100, right: 20 }}
            initial={{ opacity: 0, scale: 0.8, y: 20, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, scale: 1, y: 0, transformOrigin: "bottom right" }}
            exit={{ opacity: 0, scale: 0.85, y: 10, transformOrigin: "bottom right" }}
            transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <motion.div
              className="pointer-events-auto rounded-2xl flex flex-col border w-[92vw] max-w-[520px] h-[60vh] max-h-[720px]"
              // Glass + gradient border
              style={{
                background: "linear-gradient(180deg, rgba(17,17,20,0.8), rgba(17,17,20,0.6))",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                boxShadow: "0 0 48px rgba(139,92,246,0.22)",
                borderImage: "linear-gradient(135deg, rgba(168,85,247,0.65), rgba(34,211,238,0.45)) 1",
              }}
            >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-purple-500/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Ask Jacob AI</h3>
                  <p className="text-xs text-muted-foreground">Online</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                  aria-label="Settings"
                >
                  <Settings2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Settings Panel */}
            {showSettings && (
              <div className="p-4 border-b border-purple-500/20 bg-secondary/30">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium">Model</span>
                          <span className="text-xs text-muted-foreground">Llama 4 Scout</span>
                </div>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 w-full px-3 py-1.5 text-xs rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset Chat
                </button>
              </div>
            )}

            {/* Messages Area - Always visible */}
            <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, idx) => {
                if (msg.role === "typing") {
                  return <ChatBubble key={msg.id || idx} message="" isUser={false} isTyping={true} />;
                }
                return <ChatBubble key={msg.id || idx} message={msg.content} isUser={msg.role === "user"} />;
              })}
            </div>

            {/* Input Area - Always visible */}
            <div className="p-4 border-t border-purple-500/20">
              <div className="flex items-end gap-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about Jacob's background, skills, or projects..."
                  className="flex-1 min-h-[60px] max-h-[120px] px-4 py-3 bg-secondary/50 border border-gray-700 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm text-white placeholder:text-gray-400"
                  disabled={false}
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim()}
                  className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Local CSS keyframes for FAB animations */}
      <style jsx global>{`
        @keyframes fab-bounce {
          0% { transform: translateY(0) scale(1); }
          35% { transform: translateY(-6px) scale(1.08); }
          100% { transform: translateY(0) scale(1); }
        }
        @keyframes fab-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }
        .chat-bounce { animation: fab-bounce 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) infinite; transform-origin: center; }
        .chat-pulse { animation: fab-pulse 3s ease-in-out infinite; transform-origin: center; }
      `}</style>
    </>
  );
}
