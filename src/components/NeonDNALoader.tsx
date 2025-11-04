"use client";

import { motion } from "framer-motion";

/**
 * NeonDNALoader - Futuristic DNA Helix Orbit Animation
 * 
 * Features:
 * - Two glowing spheres orbiting vertically like DNA helix
 * - Smooth sine-wave motion with 180° phase offset
 * - Subtle purple & cyan neon glow (not overpowering)
 * - Glassy blur aura around loader
 * - 1.6s loop duration
 * - Optional pixel-glow particle dissolve on fade-out
 * - Premium cyber interface aesthetic
 */

interface NeonDNALoaderProps {
  isVisible?: boolean;
  onComplete?: () => void;
}

export default function NeonDNALoader({ 
  isVisible = true, 
  onComplete 
}: NeonDNALoaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onAnimationComplete={() => {
        if (!isVisible && onComplete) {
          onComplete();
        }
      }}
      className="fixed inset-0 z-[9998] flex items-center justify-center"
      style={{
        background: "rgba(2, 3, 20, 0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      {/* Glassy Aura Container */}
      <div className="relative w-32 h-48 flex items-center justify-center">
        {/* Subtle background glow */}
        <div
          className="absolute inset-0 rounded-full opacity-20 blur-3xl"
          style={{
            background: "radial-gradient(circle, rgba(123, 97, 255, 0.4) 0%, rgba(0, 255, 231, 0.3) 50%, transparent 70%)",
          }}
        />

        {/* DNA Helix Track (vertical line) */}
        <div className="absolute w-0.5 h-40 bg-gradient-to-b from-transparent via-purple-500/20 to-transparent" />

        {/* Sphere 1 - Purple (Top to Bottom) */}
        <motion.div
          animate={{
            y: [-60, 60, -60],
            x: [
              0,
              Math.sin(0) * 40,
              Math.sin(Math.PI / 4) * 40,
              Math.sin(Math.PI / 2) * 40,
              Math.sin((3 * Math.PI) / 4) * 40,
              Math.sin(Math.PI) * 40,
              Math.sin((5 * Math.PI) / 4) * 40,
              Math.sin((3 * Math.PI) / 2) * 40,
              Math.sin((7 * Math.PI) / 4) * 40,
              0,
            ],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute w-5 h-5 rounded-full"
          style={{
            background: "linear-gradient(135deg, #7b61ff 0%, #9d7fff 100%)",
            boxShadow: `
              0 0 15px rgba(123, 97, 255, 0.6),
              0 0 30px rgba(123, 97, 255, 0.3),
              inset 0 0 10px rgba(255, 255, 255, 0.3)
            `,
          }}
        >
          {/* Inner bright core */}
          <div className="absolute inset-[30%] rounded-full bg-white/80 blur-[2px]" />
        </motion.div>

        {/* Sphere 2 - Cyan (Bottom to Top, 180° offset) */}
        <motion.div
          animate={{
            y: [60, -60, 60],
            x: [
              0,
              -Math.sin(0) * 40,
              -Math.sin(Math.PI / 4) * 40,
              -Math.sin(Math.PI / 2) * 40,
              -Math.sin((3 * Math.PI) / 4) * 40,
              -Math.sin(Math.PI) * 40,
              -Math.sin((5 * Math.PI) / 4) * 40,
              -Math.sin((3 * Math.PI) / 2) * 40,
              -Math.sin((7 * Math.PI) / 4) * 40,
              0,
            ],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute w-5 h-5 rounded-full"
          style={{
            background: "linear-gradient(135deg, #00ffe7 0%, #5dffea 100%)",
            boxShadow: `
              0 0 15px rgba(0, 255, 231, 0.6),
              0 0 30px rgba(0, 255, 231, 0.3),
              inset 0 0 10px rgba(255, 255, 255, 0.3)
            `,
          }}
        >
          {/* Inner bright core */}
          <div className="absolute inset-[30%] rounded-full bg-white/80 blur-[2px]" />
        </motion.div>

        {/* Orbital trails (subtle) */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0.3, 0],
              y: [-60 + i * 15, 60 - i * 15],
              x: [Math.sin(i * 0.4) * 40, -Math.sin(i * 0.4) * 40],
            }}
            transition={{
              duration: 1.6,
              repeat: Infinity,
              ease: "linear",
              delay: i * 0.1,
            }}
            className="absolute w-1 h-1 rounded-full"
            style={{
              background: i % 2 === 0 ? "#7b61ff" : "#00ffe7",
              filter: `blur(1px)`,
            }}
          />
        ))}

        {/* Particle dissolve effect (shown on fade-out) */}
        {!isVisible && (
          <>
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={`particle-${i}`}
                initial={{ opacity: 0.6, scale: 1 }}
                animate={{
                  opacity: 0,
                  scale: 0.3,
                  x: Math.cos((i * Math.PI * 2) / 12) * 60,
                  y: Math.sin((i * Math.PI * 2) / 12) * 60,
                }}
                transition={{
                  duration: 0.2,
                  ease: "easeOut",
                }}
                className="absolute w-1.5 h-1.5 rounded-full"
                style={{
                  background: i % 2 === 0 ? "#7b61ff" : "#00ffe7",
                  boxShadow: `0 0 6px ${i % 2 === 0 ? "#7b61ff" : "#00ffe7"}`,
                }}
              />
            ))}
          </>
        )}
      </div>

      {/* Loading text (optional, subtle) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 0.4 : 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="absolute bottom-[35%] text-xs tracking-widest font-light"
        style={{
          color: "rgba(123, 97, 255, 0.7)",
          textShadow: "0 0 10px rgba(123, 97, 255, 0.5)",
        }}
      >
        LOADING
      </motion.div>
    </motion.div>
  );
}

