"use client";

import { motion } from "framer-motion";

interface NeonDNALoaderProps {
  isVisible?: boolean;
  onComplete?: () => void;
}

export default function NeonDNALoader({ isVisible = true, onComplete }: NeonDNALoaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onAnimationComplete={() => { if (!isVisible && onComplete) onComplete(); }}
      className="fixed inset-0 z-[9998] flex flex-col items-center justify-center gap-6"
      style={{ background: "rgba(250,249,246,0.88)", backdropFilter: "blur(14px)" }}
    >
      {/* Three cobalt bars */}
      <div className="flex items-end gap-1.5">
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="w-1 rounded-sm bg-primary"
            animate={{ scaleY: [0.3, 1, 0.3] }}
            transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut", delay: i * 0.15 }}
            style={{ height: 28, transformOrigin: "bottom" }}
          />
        ))}
      </div>

      <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-foreground/35">
        Loading
      </span>
    </motion.div>
  );
}
