"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Send, RotateCcw } from "lucide-react";
import { ChatBubble } from "./chat/ChatBubble";

interface Message {
  role: "user" | "assistant" | "typing";
  content: string;
  id?: string;
}

// The four bullets this used to list were the same four topics as the suggestion
// chips directly below it — the greeting now points at them instead of repeating
// them, which also gets the message down to two lines.
const WELCOME_TEXT = `Hi, I am Jacob's AI assistant.\n\nAsk me anything about his work, or start with one of these:`;

const CHIPS = [
  "Experience summary?",
  "Work authorization?",
  "Best projects?",
  "Tech stack?",
];

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showCallout, setShowCallout] = useState(false);
  const [input, setInput] = useState("");
  const [animClass, setAnimClass] = useState("chat-bounce");
  const [welcomeText, setWelcomeText] = useState("");
  const [welcomeDone, setWelcomeDone] = useState(false);

  const chatRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastPulseRef = useRef(false);
  const userOpenedRef = useRef(false);
  const welcomeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const welcomeSeenRef = useRef(false);

  // Scroll-driven animation class swap: bounce → pulse near Experience
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
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const top = getExperienceTop();
          if (top != null) {
            const reached = window.scrollY >= top - 120;
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
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);


  // Close chat on any scroll while open
  useEffect(() => {
    if (!isOpen) return;
    const onScroll = () => {
      setIsOpen(false);
      window.sessionStorage.setItem("chatAutoShown", "true");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isOpen]);

  // Show callout once — never again if cookie is set (30-day memory)
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (document.cookie.includes("chatCalloutSeen=1")) return;

    const dismissCallout = () => {
      setShowCallout(false);
      document.cookie = "chatCalloutSeen=1; max-age=2592000; path=/"; // 30 days
    };

    const show = setTimeout(() => {
      setShowCallout(true);

      // Auto-dismiss after 12s
      const hide = setTimeout(dismissCallout, 12000);

      // Dismiss on scroll
      const onScroll = () => { dismissCallout(); window.removeEventListener("scroll", onScroll); };
      window.addEventListener("scroll", onScroll, { passive: true });

      return () => { clearTimeout(hide); window.removeEventListener("scroll", onScroll); };
    }, 1800);

    return () => clearTimeout(show);
  }, []);

  // Sync welcomeSeenRef from sessionStorage on mount
  useEffect(() => {
    if (sessionStorage.getItem("welcomeSeen") === "1") {
      welcomeSeenRef.current = true;
    }
  }, []);

  // Typewriter welcome — skips animation if already seen this session
  useEffect(() => {
    if (!isOpen || messages.length > 0) return;

    if (welcomeTimerRef.current) clearTimeout(welcomeTimerRef.current);

    if (welcomeSeenRef.current) {
      setWelcomeText(WELCOME_TEXT);
      setWelcomeDone(true);
      return;
    }

    setWelcomeText("");
    setWelcomeDone(false);

    let i = 0;
    const typeNext = () => {
      if (i >= WELCOME_TEXT.length) {
        setWelcomeDone(true);
        welcomeSeenRef.current = true;
        sessionStorage.setItem("welcomeSeen", "1");
        return;
      }
      i++;
      setWelcomeText(WELCOME_TEXT.slice(0, i));
      const char = WELCOME_TEXT[i - 1];
      const delay = char === "\n" ? 40 : ".!?".includes(char) ? 20 : 5;
      welcomeTimerRef.current = setTimeout(typeNext, delay);
    };
    welcomeTimerRef.current = setTimeout(typeNext, 120);
    return () => { if (welcomeTimerRef.current) clearTimeout(welcomeTimerRef.current); };
  }, [isOpen, messages.length]);

  // Core streaming send
  const sendMessage = async (text: string) => {
    const userMessage = text.trim();
    if (!userMessage) return;

    const newMessages = [...messages, { role: "user" as const, content: userMessage }];
    setMessages(newMessages);
    const typingId = `typing-${Date.now()}`;
    setMessages([...newMessages, { role: "typing", content: "", id: typingId }]);

    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();

    try {
      const apiMessages = newMessages.map(m => ({ role: m.role as "user" | "assistant", content: m.content }));
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 429 || errorData.error === "rate_limited") {
          throw new Error("rate_limited");
        }
        throw new Error(errorData.error || "⚠️ AI is unavailable. Try again.");
      }

      const assistantId = `assistant-${Date.now()}`;
      setMessages(prev => [...prev, { role: "assistant", content: "", id: assistantId }]);

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error("No response stream");

      let accumulatedContent = "";
      let hasReceivedContent = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split("\n")) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (data === "[DONE]") { setMessages(prev => prev.filter(m => m.id !== typingId)); break; }
          try {
            const parsed = JSON.parse(data);
            if (parsed.error) {
              setMessages(prev => prev.filter(m => m.id !== typingId && m.id !== assistantId));
              throw new Error(parsed.error);
            }
            if (parsed.content) {
              if (!hasReceivedContent) {
                hasReceivedContent = true;
                setMessages(prev => prev.filter(m => m.id !== typingId));
              }
              accumulatedContent += parsed.content;
              setMessages(prev => {
                const lastIdx = (() => {
                  for (let i = prev.length - 1; i >= 0; i--) {
                    if (prev[i].role === "assistant") return i;
                  }
                  return -1;
                })();
                if (lastIdx === -1) return prev;
                const next = [...prev];
                next[lastIdx] = { ...next[lastIdx], content: accumulatedContent } as Message;
                return next;
              });
            }
          } catch (e) { /* skip invalid chunks */ }
        }
      }

      setMessages(prev => {
        const filtered = prev.filter(m => m.id !== typingId);
        return filtered.map(m => m.id === assistantId ? { role: "assistant" as const, content: accumulatedContent || m.content } : m);
      });
    } catch (err: any) {
      setMessages(prev => prev.filter(m => m.id !== typingId));
      if (err.name !== "AbortError") {
        const msg = err.message === "rate_limited"
          ? "You have sent a lot of messages. Please wait an hour before trying again."
          : err.message || "⚠️ AI is unavailable. Try again.";
        setMessages(prev => [...prev, { role: "assistant", content: msg }]);
      }
    } finally {
      abortControllerRef.current = null;
    }
  };

  const handleSend = () => { const t = input.trim(); if (!t) return; setInput(""); sendMessage(t); };
  const handleChipClick = (chip: string) => sendMessage(chip);
  const handleReset = () => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    setMessages([]); // triggers typewriter restart via useEffect
  };
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  // Scroll to bottom
  useEffect(() => {
    if (chatRef.current) {
      requestAnimationFrame(() => {
        if (chatRef.current) chatRef.current.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
      });
    }
  }, [messages, welcomeText]);

  // Cleanup
  useEffect(() => {
    return () => { if (abortControllerRef.current) abortControllerRef.current.abort(); };
  }, []);

  const showWelcome = messages.length === 0;

  return (
    <>
      {/* FAB — extra bottom clearance so the launcher never crowds the viewport
          edge (it was being clipped at the bottom of some windows). */}
      <div className="fixed bottom-8 right-6 z-50 group flex items-center gap-2">

        {/* First-visit callout bubble — positioned above the FAB */}
        <AnimatePresence>
          {showCallout && !isOpen && (
            <motion.button
              initial={{ opacity: 0, y: 10, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              onClick={() => {
                setShowCallout(false);
                document.cookie = "chatCalloutSeen=1; max-age=2592000; path=/";
                setIsOpen(true);
                userOpenedRef.current = true;
              }}
              className="absolute bottom-[64px] right-0 text-left px-4 py-3 w-52"
              style={{
                background: "#FEFCE8",
                border: "1px solid #FDE68A",
                boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
              }}
            >
              <p className="text-[12px] font-semibold text-yellow-900 mb-0.5">
                👋 Curious about Jacob?
              </p>
              <p className="text-[11px] text-yellow-800/70 leading-snug">
                Ask me about his experience, projects, or work authorization.
              </p>
              {/* Downward triangle tail */}
              <span
                className="absolute -bottom-[7px] right-4 border-l-[7px] border-r-[7px] border-t-[7px] border-l-transparent border-r-transparent"
                style={{ borderTopColor: "#FDE68A" }}
              />
              <span
                className="absolute -bottom-[6px] right-[17px] border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent"
                style={{ borderTopColor: "#FEFCE8" }}
              />
            </motion.button>
          )}
        </AnimatePresence>

        <div className="relative shrink-0">
          {/* Name label — sits to the LEFT of the button rather than above it.
              Above, it forced the whole launcher 28px higher to stay readable,
              which is what pushed the button off the bottom edge. */}
          <div
            className="absolute right-full top-1/2 -translate-y-1/2 mr-3 whitespace-nowrap text-[10px] font-semibold tracking-[0.13em] uppercase text-foreground/50 pointer-events-none select-none"
          >
            Jacob.ai
          </div>
          {/* Ambient pulsing ring */}
          <motion.div
            className="absolute inset-[-5px] bg-primary/15"
            animate={{ opacity: [0.4, 0.9, 0.4], scale: [0.95, 1.1, 0.95] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.button
            onClick={() => { setIsOpen(!isOpen); userOpenedRef.current = true; }}
            aria-label="Jacob.ai"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center justify-center shadow-lg relative ${animClass}`}
            style={{
              width: 52, height: 52,
              background: "linear-gradient(135deg, #B84D27 0%, #933D1F 100%)",
              boxShadow: "0 4px 24px rgba(184, 77, 39,0.45)",
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
      </div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed z-50 pointer-events-none"
            style={{ bottom: 76, right: 20 }}
            initial={{ opacity: 0, y: 18, scale: 0.95, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
          >
            {/* Panel. A static, quiet frame — the border used to pulse copper
                on a 3.5s loop, which made the widget the loudest element on a
                page built on restraint. */}
            <div
              className="pointer-events-auto flex flex-col w-[92vw] max-w-[400px] h-[60vh] max-h-[580px] bg-background overflow-hidden border border-foreground/15"
              style={{ boxShadow: "0 18px 60px -12px rgba(28, 25, 23, 0.22)" }}
            >
              {/* Header — monogram, serif name, mono status. The stock robot
                  glyph and gradient chip read as a generic SaaS widget on an
                  otherwise editorial page. */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-foreground/10 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 flex items-center justify-center bg-primary shrink-0">
                    <span className="text-primary-foreground text-[10px] font-semibold tracking-[0.08em]">
                      JK
                    </span>
                  </div>
                  <div>
                    <h3 className="font-serif font-medium text-base text-foreground leading-none mb-1.5">
                      Jacob.ai
                    </h3>
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-green-600 inline-block avail-dot" />
                      <p className="font-mono text-[9px] tracking-[0.16em] text-foreground/40 uppercase">
                        Online
                      </p>
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleReset}
                    className="p-2 text-foreground/40 hover:text-foreground transition-colors"
                    aria-label="Reset conversation"
                    title="Reset conversation"
                  >
                    <RotateCcw className="w-4 h-4" />
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

              {/* Messages */}
              <div ref={chatRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                {/* Typewriter welcome bubble */}
                {showWelcome && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-end gap-2"
                  >
                    <div className="w-6 h-6 flex items-center justify-center shrink-0 mb-0.5 bg-primary">
                      <span className="text-primary-foreground text-[8px] font-semibold tracking-[0.06em]">
                        JK
                      </span>
                    </div>
                    <div className="max-w-[82%] px-4 py-3 text-xs leading-relaxed bg-secondary/40 text-foreground border border-foreground/10">
                      <p className="whitespace-pre-wrap">
                        {welcomeText}
                        {!welcomeDone && (
                          <span className="inline-block w-[2px] h-[0.85em] bg-primary align-middle ml-0.5 animate-pulse" />
                        )}
                      </p>
                    </div>
                  </motion.div>
                )}

                {messages.map((msg, idx) => {
                  if (msg.role === "typing") return <ChatBubble key={msg.id || idx} message="" isUser={false} isTyping />;
                  return <ChatBubble key={msg.id || idx} message={msg.content} isUser={msg.role === "user"} />;
                })}
              </div>

              {/* Input area */}
              <div className="px-4 pb-4 pt-3 border-t border-foreground/8 shrink-0">
                {/* Suggestion chips — shown only before first message */}
                <AnimatePresence>
                  {showWelcome && welcomeDone && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.25 }}
                      className="flex flex-wrap gap-1.5 mb-3"
                    >
                      {CHIPS.map((chip, i) => (
                        <motion.button
                          key={chip}
                          initial={{ opacity: 0, scale: 0.88 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.07, type: "spring", stiffness: 320, damping: 22 }}
                          onClick={() => handleChipClick(chip)}
                          className="px-3 py-1.5 font-mono text-[9.5px] tracking-[0.1em] uppercase border border-foreground/15 text-foreground/55 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
                        >
                          {chip}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex items-end gap-2">
                  <textarea
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about Jacob's background..."
                    rows={2}
                    className="flex-1 px-3 py-2.5 bg-transparent border border-foreground/15 resize-none focus:outline-none focus:border-primary text-sm text-foreground placeholder:text-foreground/30 transition-colors"
                    style={{ minHeight: 56, maxHeight: 100 }}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim()}
                    className="w-10 h-10 bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-25 hover:opacity-90 active:scale-95 transition-all shrink-0"
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
