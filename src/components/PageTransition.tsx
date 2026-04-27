"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function PageTransition() {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setIsTransitioning(true);
    const timeout = setTimeout(() => setIsTransitioning(false), 800);
    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="pointer-events-none fixed inset-0 z-[99999] flex flex-col items-center justify-center gap-5"
          style={{ background: "rgba(250,249,246,0.92)", backdropFilter: "blur(12px)" }}
        >
          {/* Four cobalt bars — equalizer */}
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
      )}
    </AnimatePresence>
  );
}
