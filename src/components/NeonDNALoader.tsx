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
      transition={{ duration: 0.2 }}
      onAnimationComplete={() => { if (!isVisible && onComplete) onComplete(); }}
      className="fixed inset-0 z-[9998] flex items-center justify-center"
      style={{ background: "rgba(250,249,246,0.9)", backdropFilter: "blur(12px)" }}
    >
      <div className="relative flex items-center justify-center" style={{ width: 100, height: 100 }}>

        {/* Self-drawing border */}
        <svg
          className="absolute inset-0"
          width="100" height="100"
          viewBox="0 0 100 100"
          fill="none"
        >
          {/* Corner accents — static, appear with the overlay */}
          {[
            "M 0,12 L 0,0 L 12,0",
            "M 88,0 L 100,0 L 100,12",
            "M 100,88 L 100,100 L 88,100",
            "M 12,100 L 0,100 L 0,88",
          ].map((d, i) => (
            <motion.path
              key={i}
              d={d}
              stroke="rgb(124,58,237)"
              strokeWidth="1.5"
              strokeLinecap="square"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.9 }}
              transition={{
                pathLength: { duration: 0.35, ease: [0.23, 1, 0.32, 1], delay: i * 0.06 },
                opacity: { duration: 0.1, delay: i * 0.06 },
              }}
            />
          ))}

          {/* Full perimeter draw — thin, slightly transparent */}
          <motion.path
            d="M 0,0 L 100,0 L 100,100 L 0,100 Z"
            stroke="rgb(124,58,237)"
            strokeWidth="0.5"
            strokeOpacity="0.25"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
          />

          {/* Orbiting dot — starts after brackets finish, loops forever */}
          <circle r="2.5" fill="rgb(124,58,237)">
            <animate
              attributeName="fill-opacity"
              from="0" to="1"
              dur="0.15s" begin="0.5s" fill="freeze"
            />
            <animateMotion
              dur="1.8s"
              repeatCount="indefinite"
              begin="0.5s"
              calcMode="linear"
              path="M 0,0 L 100,0 L 100,100 L 0,100 Z"
            />
          </circle>
        </svg>

        {/* Initials */}
        <motion.span
          className="font-serif font-medium text-foreground select-none"
          style={{ fontSize: "1.75rem", letterSpacing: "-0.01em" }}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
        >
          JK
        </motion.span>

      </div>
    </motion.div>
  );
}
