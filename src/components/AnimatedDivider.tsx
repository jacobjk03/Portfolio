"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export function AnimatedDivider() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -40px 0px" });

  return (
    <div
      ref={ref}
      className="absolute bottom-0 left-0 right-0 h-px pointer-events-none overflow-hidden"
      aria-hidden
    >
      <motion.div
        className="h-full bg-primary/50"
        style={{ transformOrigin: "0% 50%" }}
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 1.4, ease: [0.23, 1, 0.32, 1], delay: 0.15 }}
      />
    </div>
  );
}
