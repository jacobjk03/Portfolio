"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface RecruiterToastProps {
  message: string;
  isVisible: boolean;
}

export function RecruiterToast({ message, isVisible }: RecruiterToastProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none"
        >
          <div className="px-6 py-3 rounded-lg bg-background/95 dark:bg-background/95 backdrop-blur-md border border-primary/30 shadow-lg">
            <p className="text-sm font-medium bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent flex items-center gap-2">
              <span>{message}</span>
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

