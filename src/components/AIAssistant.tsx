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

const WELCOME_TEXT = `Hi! I'm Jacob's AI assistant 👋\n\nYou can ask me about:\n• AI/ML, RAG & LLM projects\n• AWS, DevOps & cloud skills\n• Work authorization & availability\n• Industry & research experience\n\nHow can I help?`;

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

  // Typewriter welcome — restarts when messages cleared (reset)
  useEffect(() => {
    if (!isOpen || messages.length > 0) return;
    setWelcomeText("");
    setWelcomeDone(false);
    if (welcomeTimerRef.current) clearTimeout(welcomeTimerRef.current);

    let i = 0;
    const typeNext = () => {
      if (i >= WELCOME_TEXT.length) { setWelcomeDone(true); return; }
      i++;
      setWelcomeText(WELCOME_TEXT.slice(0, i));
      const char = WELCOME_TEXT[i - 1];
      const delay = char === "\n" ? 100 : ".!?".includes(char) ? 55 : 13;
      welcomeTimerRef.current = setTimeout(typeNext, delay);
    };
    welcomeTimerRef.current = setTimeout(typeNext, 400);
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
        setMessages(prev => [...prev, { role: "assistant", content: err.message || "⚠️ AI is unavailable. Try again." }]);
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
      {/* FAB */}
      <div className="fixed bottom-6 right-6 z-50 group flex items-center gap-2">

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

        <span className="opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-200 text-[9px] font-semibold tracking-[0.15em] uppercase text-foreground/50 whitespace-nowrap pointer-events-none bg-background border border-foreground/10 px-2.5 py-1.5 shadow-sm">
          Ask Jacob AI
        </span>
        <div className="relative shrink-0">
          {/* Ambient pulsing ring */}
          <motion.div
            className="absolute inset-[-5px] bg-primary/15"
            animate={{ opacity: [0.4, 0.9, 0.4], scale: [0.95, 1.1, 0.95] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.button
            onClick={() => { setIsOpen(!isOpen); userOpenedRef.current = true; }}
            aria-label="Ask Jacob AI"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center justify-center shadow-lg relative ${animClass}`}
            style={{
              width: 52, height: 52,
              background: "linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)",
              boxShadow: "0 4px 24px rgba(124,58,237,0.45)",
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
            {/* Glowing border wrapper */}
            <motion.div
              className="pointer-events-auto flex flex-col w-[92vw] max-w-[400px] h-[60vh] max-h-[580px] bg-background overflow-hidden"
              style={{ border: "1px solid rgba(124,58,237,0.22)" }}
              animate={{
                boxShadow: [
                  "0 8px 40px rgba(124,58,237,0.10), 0 0 0 1px rgba(124,58,237,0.12)",
                  "0 12px 48px rgba(124,58,237,0.22), 0 0 0 1px rgba(124,58,237,0.32)",
                  "0 8px 40px rgba(124,58,237,0.10), 0 0 0 1px rgba(124,58,237,0.12)",
                ],
              }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* Header */}
              <div
                className="flex items-center justify-between px-5 py-3.5 border-b border-foreground/8 shrink-0"
                style={{ background: "linear-gradient(90deg, rgba(124,58,237,0.07) 0%, transparent 70%)" }}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div
                      className="w-8 h-8 flex items-center justify-center"
                      style={{ background: "linear-gradient(135deg, #7C3AED, #6D28D9)" }}
                    >
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <motion.span
                      className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-background"
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground leading-none mb-1">Ask Jacob AI</h3>
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                      <p className="text-[10px] font-medium tracking-wide text-foreground/40 uppercase">Online</p>
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
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mb-0.5"
                      style={{ background: "linear-gradient(135deg, #7C3AED, #6D28D9)" }}
                    >
                      <Bot className="w-3 h-3 text-white" />
                    </div>
                    <div className="max-w-[82%] px-4 py-2.5 text-xs leading-relaxed bg-foreground/5 text-foreground border border-foreground/8">
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
                          className="px-3 py-1.5 text-[10px] font-semibold tracking-[0.08em] uppercase border border-primary/20 text-primary/65 hover:bg-primary/10 hover:border-primary/45 hover:text-primary transition-all"
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
                    className="flex-1 px-3 py-2.5 bg-secondary/50 border border-foreground/10 resize-none focus:outline-none focus:border-primary/40 text-sm text-foreground placeholder:text-foreground/30 transition-colors"
                    style={{ minHeight: 56, maxHeight: 100 }}
                  />
                  <motion.button
                    onClick={handleSend}
                    disabled={!input.trim()}
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.94 }}
                    className="w-10 h-10 text-white flex items-center justify-center disabled:opacity-30 transition-opacity shrink-0"
                    style={{ background: "linear-gradient(135deg, #7C3AED, #6D28D9)" }}
                    aria-label="Send"
                  >
                    <Send className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
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
