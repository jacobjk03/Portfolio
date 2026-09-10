"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

/**
 * A single headline number.
 *
 * Deliberately not a chart: a lone value has no comparison to encode, and
 * plotting one number as a bar invents a scale the data doesn't have. The
 * number itself is the visualisation — set it large and let the label carry
 * the context.
 */

export interface StatTileProps {
  value: string;
  label: string;
  context?: string;
  delay?: number;
}

export function StatTile({ value, label, context, delay = 0 }: StatTileProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref as any, { once: true, margin: "-50px 0px" });

  return (
    <motion.div
      ref={ref}
      className="border-t border-foreground/12 pt-4"
      initial={{ opacity: 0, y: 10 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: [0.23, 1, 0.32, 1] }}
    >
      <p
        className="font-serif font-medium leading-none mb-2"
        style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", color: "hsl(var(--data-1))" }}
      >
        {value}
      </p>
      <p className="text-[10px] font-semibold tracking-[0.14em] uppercase text-foreground/55">
        {label}
      </p>
      {context && (
        <p className="text-[11px] text-foreground/40 mt-1 leading-snug">{context}</p>
      )}
    </motion.div>
  );
}
