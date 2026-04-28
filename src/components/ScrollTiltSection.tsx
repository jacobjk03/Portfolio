"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export function ScrollTiltSection({ children, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const rotateX = useTransform(
    scrollYProgress,
    [0, 0.18, 0.42, 0.58, 0.82, 1],
    [8, 1.5, 0, 0, -1, -6]
  );
  const scale = useTransform(
    scrollYProgress,
    [0, 0.18, 0.42, 0.58, 0.82, 1],
    [0.96, 0.99, 1, 1, 0.99, 0.97]
  );
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.14, 0.86, 1],
    [0.6, 1, 1, 0.65]
  );

  return (
    <div ref={ref} style={{ perspective: "1400px" }} className={className}>
      <motion.div
        style={{
          rotateX,
          scale,
          opacity,
          transformOrigin: "center center",
          willChange: "transform, opacity",
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
