"use client";

import { useState, useEffect, useRef } from "react";
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
  
  const chatRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  // No retry timers; show a single clean error on failure

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
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-110 group"
        style={{
          boxShadow: "0 0 20px rgba(139, 92, 246, 0.5), 0 0 40px rgba(0, 207, 255, 0.3)",
        }}
        aria-label="Open AI Assistant"
      >
        <Bot className="w-6 h-6 text-white" />
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 opacity-0 group-hover:opacity-100 animate-pulse" />
      </button>

      {/* Badge Text */}
      <div className="fixed bottom-20 right-6 z-50 text-xs text-muted-foreground text-right max-w-[140px]">
        AI-powered portfolio
      </div>

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-end md:justify-center p-4 pointer-events-none">
          <div
            className="w-full md:w-[500px] h-[600px] md:h-[700px] bg-background/95 dark:bg-background/95 backdrop-blur-xl border border-purple-500/20 rounded-2xl shadow-2xl flex flex-col pointer-events-auto"
            style={{
              boxShadow: "0 0 40px rgba(139, 92, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
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
            <div
              ref={chatRef}
              className="flex-1 overflow-y-auto p-4 space-y-4"
            >
              {messages.map((msg, idx) => {
                if (msg.role === "typing") {
                  return (
                    <ChatBubble
                      key={msg.id || idx}
                      message=""
                      isUser={false}
                      isTyping={true}
                    />
                  );
                }
                return (
                  <ChatBubble
                    key={msg.id || idx}
                    message={msg.content}
                    isUser={msg.role === "user"}
                  />
                );
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
          </div>
        </div>
      )}
    </>
  );
}
