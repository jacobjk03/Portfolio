"use client";

import { motion, AnimatePresence } from "framer-motion";

interface RecruiterToastProps {
  message: string;
  isVisible: boolean;
  isOn?: boolean;
}

export function RecruiterToast({ isVisible, isOn }: RecruiterToastProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.95 }}
          transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] pointer-events-none"
        >
          <div
            className="flex items-center gap-2.5 px-5 py-3 bg-background/95 backdrop-blur-md border border-primary/25 shadow-[0_4px_24px_rgba(124,58,237,0.12)]"
          >
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ background: isOn ? "#7C3AED" : "#94a3b8" }}
            />
            <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-primary whitespace-nowrap">
              {isOn ? "Recruiter mode on — optimized for hiring review" : "Recruiter mode off"}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
