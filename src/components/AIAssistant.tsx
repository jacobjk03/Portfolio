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

  // Auto-open chat once per session on larger screens (≥768px), then auto-close on first scroll if user hasn't interacted
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    // Check viewport width - only auto-open on desktop/tablet (≥768px)
    const isLargeScreen = window.innerWidth >= 768;
    
    // Skip if mobile device or already shown in this session
    if (!isLargeScreen) {
      // On mobile, mark as shown to prevent any auto-open attempts
      window.sessionStorage.setItem("chatAutoShown", "true");
      return;
    }
    
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
          content: `Hi! I'm Jacob's AI assistant 👋\n\nCurious about his background or experience?\n\nYou can ask me about:\n• AI/ML & data engineering experience\n• RAG & LLM projects\n• AWS, DevOps & cloud skills\n• Work authorization & graduation timeline\n• Past work experience (industry + research)\n• Leadership, teaching, and teamwork experience\n\nHow can I help you learn more about Jacob?`,
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
        content: `Hi! I'm Jacob's AI assistant 👋\n\nCurious about his background or experience?\n\nYou can ask me about:\n• AI/ML & data engineering experience\n• RAG & LLM projects\n• AWS, DevOps & cloud skills\n• Work authorization & graduation timeline\n• Past work experience (industry + research)\n• Leadership, teaching, and teamwork experience\n\nHow can I help you learn more about Jacob?`,
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

  // Handle quick button for work authorization - auto-sends the question
  const handleWorkAuthClick = async () => {
    const question = "What is your work authorization status?";
    
    // Create newMessages including the user's question
    const newMessages = [...messages, { role: "user" as const, content: question }];
    
    // Update state immediately so UI shows the user's message
    setMessages(newMessages);
    
    // Add typing placeholder immediately
    const typingId = `typing-${Date.now()}`;
    setMessages([...newMessages, { role: "typing", content: "", id: typingId }]);
    
    // Cancel any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    
    try {
      // Build API payload from newMessages
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
      
      // Add assistant message placeholder
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
              setMessages((prev) => prev.filter((m) => m.id !== typingId));
              break;
            }
            try {
              const parsed = JSON.parse(data);
              if (parsed.error) {
                setMessages((prev) => prev.filter((m) => m.id !== typingId && m.id !== assistantId));
                throw new Error(parsed.error);
              }
              if (parsed.content) {
                if (!hasReceivedContent) {
                  hasReceivedContent = true;
                  setMessages((prev) => prev.filter((m) => m.id !== typingId));
                }
                accumulatedContent += parsed.content;
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
      
      // Append error message
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

  return (
    <>
      {/* FAB — cobalt square button with hover tooltip */}
      <div className="fixed bottom-6 right-6 z-50 group flex items-center gap-2">
        {/* Tooltip label — slides in from right on hover */}
        <span className="opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-200 text-[9px] font-semibold tracking-[0.15em] uppercase text-foreground/50 whitespace-nowrap pointer-events-none bg-background border border-foreground/10 px-2.5 py-1.5 shadow-sm">
          Ask Jacob AI
        </span>
        <motion.button
          onClick={() => { setIsOpen(!isOpen); userOpenedRef.current = true; }}
          aria-label="Ask Jacob AI"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          className={`flex items-center justify-center shadow-lg shrink-0 ${animClass}`}
          style={{
            width: 52,
            height: 52,
            background: "#7C3AED",
            boxShadow: "0 4px 20px rgba(124,58,237,0.35)",
          }}
        >
          <motion.div
            animate={{ rotate: [0, 6, -6, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Bot className="w-5 h-5 text-white" />
          </motion.div>
        </motion.button>
      </div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed z-50 pointer-events-none"
            style={{ bottom: 76, right: 20 }}
            initial={{ opacity: 0, y: 12, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <div
              className="pointer-events-auto flex flex-col w-[92vw] max-w-[400px] h-[60vh] max-h-[580px] bg-background border border-foreground/10"
              style={{ boxShadow: "0 8px 48px rgba(0,0,0,0.12)" }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-foreground/8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-cobalt flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground leading-none mb-0.5">Ask Jacob AI</h3>
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                      <p className="text-[10px] font-medium tracking-wide text-foreground/40 uppercase">Online</p>
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="p-2 text-foreground/40 hover:text-foreground transition-colors"
                    aria-label="Settings"
                  >
                    <Settings2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 text-foreground/40 hover:text-foreground transition-colors"
                    aria-label="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Settings panel */}
              {showSettings && (
                <div className="px-5 py-3 border-b border-foreground/8 bg-secondary/40">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[11px] font-semibold tracking-[0.1em] uppercase text-foreground/50">Model</span>
                    <span className="text-[11px] text-foreground/40">Llama 4 Scout</span>
                  </div>
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.08em] uppercase text-foreground/50 hover:text-primary transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset Conversation
                  </button>
                </div>
              )}

              {/* Messages */}
              <div ref={chatRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                {messages.map((msg, idx) => {
                  if (msg.role === "typing") {
                    return <ChatBubble key={msg.id || idx} message="" isUser={false} isTyping={true} />;
                  }
                  return <ChatBubble key={msg.id || idx} message={msg.content} isUser={msg.role === "user"} />;
                })}
              </div>

              {/* Input area */}
              <div className="px-4 pb-4 pt-3 border-t border-foreground/8">
                {/* Quick action */}
                <button
                  onClick={handleWorkAuthClick}
                  className="mb-3 w-full px-4 py-2 border border-cobalt/30 text-[11px] font-semibold tracking-[0.1em] uppercase text-cobalt hover:bg-cobalt/5 transition-colors"
                >
                  Work Authorization Info
                </button>
                <div className="flex items-end gap-2">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about Jacob's background..."
                    rows={2}
                    className="flex-1 px-3 py-2.5 bg-secondary/50 border border-foreground/10 resize-none focus:outline-none focus:border-cobalt/50 text-sm text-foreground placeholder:text-foreground/30 transition-colors"
                    style={{ minHeight: 56, maxHeight: 100 }}
                  />
                  <button
                    onClick={() => handleSend()}
                    disabled={!input.trim()}
                    className="w-10 h-10 bg-cobalt text-white flex items-center justify-center disabled:opacity-30 hover:brightness-110 active:scale-95 transition-all shrink-0"
                    aria-label="Send"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        @keyframes fab-bounce {
          0% { transform: translateY(0); }
          40% { transform: translateY(-5px); }
          100% { transform: translateY(0); }
        }
        @keyframes fab-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.04); }
        }
        .chat-bounce { animation: fab-bounce 1.4s cubic-bezier(0.2, 0.8, 0.2, 1) infinite; }
        .chat-pulse  { animation: fab-pulse 2.5s ease-in-out infinite; }
      `}</style>
    </>
  );
}
