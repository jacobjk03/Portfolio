"use client";

import { MessageCircle, User } from "lucide-react";

interface ChatBubbleProps {
  message: string;
  isUser: boolean;
  isTyping?: boolean;
}

/**
 * Chat Bubble Component
 * Displays individual messages with neon styling
 */
export function ChatBubble({ message, isUser, isTyping }: ChatBubbleProps) {
  return (
    <div
      className={`flex items-start gap-3 mb-4 ${
        isUser ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser
            ? "bg-primary/20 text-primary"
            : "bg-gradient-to-br from-purple-500/20 to-cyan-500/20 text-purple-400"
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4" />
        ) : (
          <MessageCircle className="w-4 h-4" />
        )}
      </div>

      {/* Message Bubble */}
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-[#2b2b2f] border border-gray-700 text-white"
            : "bg-secondary/50 border border-purple-500/20 text-foreground"
        }`}
      >
        {isTyping ? (
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        ) : (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message}</p>
        )}
      </div>
    </div>
  );
}

