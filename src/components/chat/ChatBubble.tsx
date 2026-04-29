"use client";

import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ChatBubbleProps {
  message: string;
  isUser: boolean;
  isTyping?: boolean;
}

export function ChatBubble({ message, isUser, isTyping }: ChatBubbleProps) {
  return (
    <motion.div
      className={`flex items-end gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}
      initial={{ opacity: 0, x: isUser ? 14 : -14, y: 4 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ type: "spring", stiffness: 380, damping: 26 }}
    >
      {/* Assistant avatar */}
      {!isUser && (
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mb-0.5"
          style={{ background: "linear-gradient(135deg, #7C3AED, #6D28D9)" }}
        >
          <span className="text-white text-[9px] font-bold">JK</span>
        </div>
      )}

      {/* Bubble */}
      <div
        className={`max-w-[82%] px-4 py-2.5 text-xs leading-relaxed ${
          isUser
            ? "text-white"
            : "bg-foreground/5 text-foreground border border-foreground/8"
        }`}
        style={isUser ? { background: "linear-gradient(135deg, #7C3AED, #6D28D9)" } : undefined}
      >
        {isTyping ? (
          <div className="flex items-center gap-1.5 py-0.5">
            {[0, 0.15, 0.3].map((delay, i) => (
              <motion.span
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-primary/50"
                animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 0.8, repeat: Infinity, delay, ease: "easeInOut" }}
              />
            ))}
          </div>
        ) : isUser ? (
          <p className="whitespace-pre-wrap">{message}</p>
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
              strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
              ul: ({ children }) => <ul className="list-none space-y-0.5 my-1">{children}</ul>,
              li: ({ children }) => (
                <li className="flex gap-2 text-xs">
                  <span className="text-primary mt-0.5 shrink-0">•</span>
                  <span>{children}</span>
                </li>
              ),
              code: ({ children }) => (
                <code className="px-1 py-0.5 bg-foreground/8 text-[12px] font-mono">{children}</code>
              ),
            }}
          >
            {message}
          </ReactMarkdown>
        )}
      </div>
    </motion.div>
  );
}
