"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

/**
 * PageTransition - AI Neural Orb Loading Animation
 * 
 * Features:
 * - Glowing AI orb that pulses like breathing
 * - Electric neon gradient (#7b61ff → #00ffe7)
 * - Rotating ring halo around orb
 * - Cinematic backdrop blur during transition
 * - Background fade with grain shimmer effect
 * - Triggers on Next.js route changes
 * - Runs for 1.2s with smooth fade in/out
 * - Non-blocking once complete
 * - Premium, futuristic aesthetic
 */

export default function PageTransition() {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // Trigger cinematic transition on pathname change
    setIsTransitioning(true);

    // Run for 1200ms then fade out
    const timeout = setTimeout(() => {
      setIsTransitioning(false);
    }, 1200);

    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-[99999] flex items-center justify-center transition-all duration-700 ${
        isTransitioning ? "opacity-100 backdrop-blur-md" : "opacity-0 backdrop-blur-0"
      }`}
      style={{
        background: isTransitioning
          ? "radial-gradient(circle at center, rgba(2, 3, 20, 0.95) 0%, rgba(2, 3, 20, 0.98) 100%)"
          : "transparent",
      }}
    >
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {/* Grain Shimmer Background */}
            <div
              className="absolute inset-0 opacity-[0.05]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3.5' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                backgroundRepeat: "repeat",
              }}
            />

            {/* AI Neural Orb Container */}
            <div className="relative w-32 h-32">
              {/* Rotating Ring Halo */}
              <motion.div
                animate={{
                  rotate: 360,
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute inset-0 rounded-full bg-gradient-to-r from-[#7b61ff] via-[#00ffe7] to-[#7b61ff] blur-md opacity-70"
                style={{
                  backgroundSize: "200% 200%",
                }}
              />

              {/* Pulsing Glow Layers */}
              <motion.div
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 rounded-full bg-[#7b61ff] blur-xl opacity-50"
              />
              <motion.div
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute inset-0 rounded-full bg-[#00ffe7] blur-xl opacity-50"
              />

              {/* Main Orb */}
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="relative w-full h-full rounded-full bg-gradient-to-br from-[#7b61ff] to-[#00ffe7] flex items-center justify-center shadow-2xl"
                style={{
                  boxShadow: "0 0 30px rgba(123, 97, 255, 0.8), 0 0 60px rgba(0, 255, 231, 0.6)",
                }}
              >
                {/* Inner Core */}
                <div className="w-1/3 h-1/3 rounded-full bg-white opacity-90 blur-sm" />
                {/* Inset Lighting */}
                <div className="absolute inset-0 rounded-full ring-4 ring-inset ring-white/10" />
              </motion.div>

              {/* Energy Particles */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{
                    x: 0,
                    y: 0,
                    opacity: 0,
                    scale: 0.5,
                  }}
                  animate={{
                    x: [0, Math.cos(i * (Math.PI / 3)) * 60],
                    y: [0, Math.sin(i * (Math.PI / 3)) * 60],
                    opacity: [0, 1, 0],
                    scale: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeOut",
                  }}
                  className="absolute left-1/2 top-1/2 w-2 h-2 rounded-full -translate-x-1/2 -translate-y-1/2"
                  style={{
                    background: i % 2 === 0 ? "#7b61ff" : "#00ffe7",
                    boxShadow: `0 0 8px ${i % 2 === 0 ? "#7b61ff" : "#00ffe7"}`,
                  }}
                />
              ))}
            </div>

            {/* Loading Text */}
            {isTransitioning && (
              <div
                className="absolute bottom-[30%] text-sm font-medium tracking-wider transition-opacity duration-500"
                style={{
                  opacity: isTransitioning ? 0.6 : 0,
                }}
              >
                <motion.span
                  animate={{
                    backgroundPosition: ["0% 50%", "200% 50%"],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{
                    background: "linear-gradient(90deg, #7b61ff, #00ffe7, #7b61ff)",
                    backgroundSize: "200% auto",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    display: "inline-block",
                  }}
                >
                  Loading
                </motion.span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

