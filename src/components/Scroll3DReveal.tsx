"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface Scroll3DRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

/**
 * Wraps heading content in a scroll-driven rotateX reveal.
 * Heading tilts back (-18deg) when off-screen and rotates to flat (0deg) as it enters.
 * GPU-composited transform — zero layout/paint cost.
 */
export function Scroll3DReveal({ children, className = "", delay = 0 }: Scroll3DRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 95%", "start 30%"],
  });

  const rotateX = useTransform(scrollYProgress, [0, 1], ["-20deg", "0deg"]);
  const opacity  = useTransform(scrollYProgress, [0, 0.35, 1], [0, 0.6, 1]);
  const translateY = useTransform(scrollYProgress, [0, 1], ["10px", "0px"]);

  return (
    <div ref={ref} style={{ perspective: "1000px" }} className={className}>
      <motion.div
        style={{ rotateX, opacity, y: translateY, transformOrigin: "top center" }}
        transition={{ delay }}
      >
        {children}
      </motion.div>
    </div>
  );
}
