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
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
    >
      {/* Avatar dot */}
      {!isUser && (
        <div className="w-6 h-6 rounded-full bg-cobalt flex items-center justify-center shrink-0 mb-0.5">
          <span className="text-white text-[9px] font-bold">JK</span>
        </div>
      )}

      {/* Bubble */}
      <div
        className={`max-w-[82%] px-4 py-2.5 text-xs leading-relaxed ${
          isUser
            ? "bg-cobalt text-white"
            : "bg-foreground/5 text-foreground border border-foreground/8"
        }`}
      >
        {isTyping ? (
          <div className="flex items-center gap-1 py-0.5">
            <span className="w-1.5 h-1.5 bg-cobalt rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-1.5 h-1.5 bg-cobalt rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-1.5 h-1.5 bg-cobalt rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
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
                  <span className="text-cobalt mt-0.5 shrink-0">•</span>
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
