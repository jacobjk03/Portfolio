"use client";

import { motion, AnimatePresence } from "framer-motion";
import React from "react";

interface AIHintProps {
  show: boolean;
  text: string;
}

/**
 * Floating glassmorphism tooltip used by the AI assistant button
 * - Keep colors in tailwind classes below for easy tweaking
 */
export function AIHint({ show, text }: AIHintProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 6, scale: 0.98 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="absolute bottom-[64px] right-0 pointer-events-none select-none"
        >
          <div
            className="relative px-3 py-2 rounded-xl text-xs font-medium text-white/90 shadow-lg backdrop-blur-md bg-[rgba(17,17,20,0.6)] border"
            style={{
              borderImage: "linear-gradient(135deg, rgba(168,85,247,0.6), rgba(34,211,238,0.35)) 1",
              boxShadow: "0 0 22px rgba(139,92,246,0.25)",
            }}
          >
            {text}
            {/* Arrow */}
            <div
              className="absolute -bottom-2 right-3 w-3 h-3 rotate-45 bg-[rgba(17,17,20,0.6)] border-r border-b"
              style={{
                borderImage: "linear-gradient(135deg, rgba(168,85,247,0.6), rgba(34,211,238,0.35)) 1",
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


