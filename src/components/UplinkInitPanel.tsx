"use client";

import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface UplinkInitPanelProps {
  onComplete: () => void;
}

/**
 * Neural Uplink Initialization Sequence
 * 
 * Animation Timeline (5s total):
 * - 0.0s - 1.0s: Line 1 "Establishing neural uplink..." + scanline
 * - 1.0s - 2.0s: Line 2 "Scanning environment..." + scanline
 * - 2.0s - 3.0s: Line 3 "Securing encrypted channel..." + scanline
 * - 3.0s - 4.0s: Final "Secure uplink established ✅"
 * - 4.0s - 5.0s: Form reveal (fade + slide, 1s)
 * 
 * Transitions:
 * - Opacity: ease-in-out for smooth fades
 * - Transform (y): ease-out for scanline sweeps
 * - Transform (x): ease-out for micro vibration
 * - Filter (blur): smooth backdrop pulse
 * 
 * Motion-Reduced:
 * - Handled via media query check in useEffect
 * - Skips to form instantly (0.3s fade) if preferred
 */
export function UplinkInitPanel({ onComplete }: UplinkInitPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const isRevealed = useScrollReveal(panelRef, 0.3);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [currentLine, setCurrentLine] = useState(0);
  const [showFinal, setShowFinal] = useState(false);

  const lines = [
    "Establishing neural uplink...",
    "Scanning environment...",
    "Securing encrypted channel...",
  ];

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
  }, []);

  useEffect(() => {
    if (isRevealed && !prefersReducedMotion) {
      const timers = [
        setTimeout(() => setCurrentLine(1), 1000),
        setTimeout(() => setCurrentLine(2), 2000),
        setTimeout(() => setCurrentLine(3), 3000),
        setTimeout(() => setShowFinal(true), 3000),
        setTimeout(() => onComplete(), 4000),
      ];

      return () => timers.forEach(clearTimeout);
    } else if (isRevealed && prefersReducedMotion) {
      const timer = setTimeout(() => onComplete(), 300);
      return () => clearTimeout(timer);
    }
  }, [isRevealed, onComplete, prefersReducedMotion]);

  if (prefersReducedMotion) {
    return (
      <div ref={panelRef} className="relative min-h-[200px] flex items-center justify-center py-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isRevealed ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center text-sm font-mono text-cyan-400"
        >
          Secure uplink established ✅
        </motion.div>
      </div>
    );
  }

  return (
    <div ref={panelRef} className="relative min-h-[280px] flex items-center justify-center py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={isRevealed ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative w-full max-w-2xl mx-auto"
      >
        <div className="relative rounded-2xl bg-black/20 dark:bg-black/40 backdrop-blur-xl border border-cyan-400/30 shadow-[0_0_30px_rgba(34,211,238,0.2)] p-8 overflow-hidden min-h-[160px]">
          <motion.div
            className="absolute inset-0 bg-cyan-400/10 rounded-2xl pointer-events-none"
            animate={isRevealed ? { 
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.015, 1]
            } : {}}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              filter: "blur(20px)",
            }}
          />

          <AnimatePresence mode="wait">
            {currentLine < 3 && (
              <motion.div
                key={`line-${currentLine}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="relative z-10 space-y-3"
              >
                {lines.slice(0, currentLine + 1).map((line, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index === currentLine ? 0 : 0 }}
                    className="flex items-center gap-3"
                  >
                    <motion.div
                      className="w-2 h-2 rounded-full bg-cyan-400 flex-shrink-0"
                      animate={{ opacity: [0.6, 1, 0.6] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    <span className="text-sm font-mono text-cyan-400 tracking-wide">
                      {line}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {showFinal && (
              <motion.div
                key="final"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative z-10 flex items-center justify-center gap-3"
              >
                <motion.div
                  className="w-2 h-2 rounded-full bg-green-400"
                  animate={{ 
                    opacity: [0.6, 1, 0.6],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ duration: 1.0, repeat: 1 }}
                />
                <span className="text-sm font-mono text-green-400 tracking-wider font-medium">
                  Secure uplink established ✅
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {currentLine < 3 && (
            <motion.div
              key={`scan-${currentLine}`}
              className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent pointer-events-none"
              initial={{ y: 0, opacity: 0 }}
              animate={{ 
                y: 200,
                opacity: [0, 1, 0.6, 0]
              }}
              transition={{ 
                duration: 0.6,
                ease: "easeOut",
                repeat: currentLine < 3 ? Infinity : 0,
                repeatDelay: 0.4
              }}
              style={{
                filter: "blur(1px)",
                boxShadow: "0 0 15px rgba(34, 211, 238, 0.8)",
              }}
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 pointer-events-none" />
        </div>
      </motion.div>
    </div>
  );
}

