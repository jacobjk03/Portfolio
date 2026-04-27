"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface SectionNumberProps {
  number: string;
}

/**
 * Decorative background section number that slowly rotates in 3D as you scroll past.
 * Replaces the static <span> in each section — same visual, adds scroll-linked depth.
 */
export function SectionNumber({ number }: SectionNumberProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Slowly rotate on Y axis as the section scrolls through the viewport
  const rotateY = useTransform(scrollYProgress, [0, 1], ["-30deg", "30deg"]);
  // Subtle tilt back/forward
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], ["8deg", "0deg", "-8deg"]);
  // Slight scale to add depth illusion
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.92, 1, 0.92]);

  return (
    <div
      ref={ref}
      className="absolute top-6 right-6 md:right-12 lg:right-20 pointer-events-none select-none"
      style={{ perspective: "600px" }}
    >
      <motion.span
        style={{
          rotateY,
          rotateX,
          scale,
          display: "block",
          fontSize: "clamp(6rem, 16vw, 14rem)",
          transformOrigin: "center center",
        }}
        className="font-serif font-bold text-foreground/[0.035] leading-none"
      >
        {number}
      </motion.span>
    </div>
  );
}
