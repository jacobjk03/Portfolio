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
          transition={{ duration: 0.2 }}
          className="pointer-events-none fixed inset-0 z-[99999] flex items-center justify-center"
          style={{ background: "rgba(250,249,246,0.92)", backdropFilter: "blur(12px)" }}
        >
          <div className="relative flex items-center justify-center" style={{ width: 100, height: 100 }}>

            {/* Full perimeter ghost border */}
            <svg className="absolute inset-0" width="100" height="100" viewBox="0 0 100 100" fill="none">
              <motion.path
                d="M 0,0 L 100,0 L 100,100 L 0,100 Z"
                stroke="rgb(124,58,237)"
                strokeWidth="0.5"
                strokeOpacity="0.25"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
              />

              {/* Corner brackets — staggered */}
              {[
                "M 0,14 L 0,0 L 14,0",
                "M 86,0 L 100,0 L 100,14",
                "M 100,86 L 100,100 L 86,100",
                "M 14,100 L 0,100 L 0,86",
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
                    pathLength: { duration: 0.32, ease: [0.23, 1, 0.32, 1], delay: i * 0.07 },
                    opacity: { duration: 0.08, delay: i * 0.07 },
                  }}
                />
              ))}

              {/* Orbiting dot — starts after brackets finish, loops forever */}
              <circle r="2.5" fill="rgb(124,58,237)">
                <animate
                  attributeName="fill-opacity"
                  from="0" to="1"
                  dur="0.15s" begin="0.55s" fill="freeze"
                />
                <animateMotion
                  dur="1.8s"
                  repeatCount="indefinite"
                  begin="0.55s"
                  calcMode="linear"
                  path="M 0,0 L 100,0 L 100,100 L 0,100 Z"
                />
              </circle>
            </svg>

            {/* Initials */}
            <motion.span
              className="font-serif font-medium text-foreground select-none"
              style={{ fontSize: "1.75rem", letterSpacing: "-0.01em" }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.28, duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
            >
              JK
            </motion.span>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
