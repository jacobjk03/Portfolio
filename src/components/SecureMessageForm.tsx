"use client";

import { motion } from "framer-motion";
import { useScanSweep } from "@/hooks/useScanSweep";
import { ReactNode, useState, useEffect } from "react";

interface SecureMessageFormProps {
  children: ReactNode;
  isRevealed: boolean;
}

/**
 * Secure Message Form Reveal Component
 * 
 * Animation Timeline (triggered after 4.0s uplink):
 * - 0.0s - 0.1s: Tiny vibration (±2px jitter)
 * - 0.0s - 1.0s: Form fade + slide up (10px, ease-out)
 * - Parallel: Scanline sweep (0.5s)
 * - Continuous: Shield glow breathing (3s loop)
 * 
 * Transitions:
 * - Opacity: ease-in-out for smooth fade-in
 * - Transform (y): ease-out for slide-up motion (10px)
 * - Transform (x): ease-out for micro jitter (±2px)
 * - Shield glow: ease-in-out for breathing pulse
 * 
 * Motion-Reduced:
 * - Detected via media query
 * - Skips jitter, scan, particles, glow
 * - Simple fade-in only (0.4s)
 */
export function SecureMessageForm({ children, isRevealed }: SecureMessageFormProps) {
  const { isScanning, progress } = useScanSweep(isRevealed, 500);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={
        isRevealed
          ? {
              opacity: 1,
              y: 0,
              x: !prefersReducedMotion ? [0, -2, 2, -1, 1, 0] : 0,
            }
          : { opacity: 0, y: 10 }
      }
      transition={{
        opacity: { duration: 1.0, ease: "easeInOut" },
        y: { duration: 1.0, ease: "easeOut" },
        x: { duration: 0.1, ease: "easeOut" },
      }}
      className="relative"
    >
      {isRevealed && !prefersReducedMotion && (
        <>
          <motion.div
            className="absolute -inset-8 rounded-3xl pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0, 0.2, 0.12],
              scale: [0.96, 1.03, 1],
            }}
            transition={{
              opacity: { duration: 1.2, times: [0, 0.4, 1], ease: "easeInOut" },
              scale: { duration: 1.2, times: [0, 0.4, 1], ease: "easeOut" },
            }}
            style={{
              background: "radial-gradient(circle at center, rgba(34, 211, 238, 0.15) 0%, transparent 70%)",
              filter: "blur(30px)",
            }}
          />

          <motion.div
            className="absolute -inset-4 rounded-2xl border border-cyan-400/10 pointer-events-none"
            animate={{ 
              opacity: [0.08, 0.18, 0.08],
              scale: [1, 1.006, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              boxShadow: "0 0 30px rgba(34, 211, 238, 0.1)",
            }}
          />
        </>
      )}

      {isScanning && !prefersReducedMotion && (
        <motion.div
          className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent pointer-events-none z-50"
          style={{
            top: `${progress * 100}%`,
            filter: "blur(1.5px)",
            boxShadow: "0 0 18px rgba(34, 211, 238, 0.9)",
          }}
        />
      )}

      {isScanning && !prefersReducedMotion && (
        <div className="absolute inset-0 pointer-events-none z-40">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                opacity: 0,
                x: Math.random() * 80 - 40,
                y: Math.random() * 60,
              }}
              animate={{
                opacity: [0, 0.6, 0],
                y: Math.random() * 180 + 60,
              }}
              transition={{
                duration: 1.0,
                delay: i * 0.03,
                ease: "easeOut",
              }}
              className="absolute w-0.5 h-0.5 bg-cyan-400 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${progress * 100}%`,
                boxShadow: "0 0 5px rgba(34, 211, 238, 0.9)",
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

