"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

/**
 * Slope chart for a single before/after measure.
 *
 * Form choice: the data's job is "change between two states", which is exactly
 * what a slope chart encodes — the eye reads the angle, not the numbers.
 *
 * These render as small multiples (one chart per measure) rather than one chart
 * with two y-scales. Accuracy is a percentage and macro-F1 is a 0–1 ratio; on a
 * shared axis one of them would have to be rescaled, which is the dual-axis
 * mistake. Separate charts keep each measure in its own honest units.
 *
 * Colours come from --data-1 / --data-2, validated for contrast and
 * colour-vision separation (ΔE 18.8 under protanopia) in both themes.
 */

export interface MetricSlopeProps {
  label: string;
  /** Unit shown under the label, e.g. "accuracy" or "macro F1". */
  unit?: string;
  before: number;
  after: number;
  /** Axis floor/ceiling in data units. */
  min: number;
  max: number;
  /** Formats a value for its direct label. */
  format?: (v: number) => string;
  beforeLabel?: string;
  afterLabel?: string;
  /**
   * The change, stated in the measure's own units.
   *
   * Deliberately explicit rather than computed as a relative percentage: for a
   * measure that is itself a percentage, "63% improvement" (56.5 → 92.3) is a
   * percentage of a percentage and reads as though accuracy hit 63%. Points and
   * absolute deltas can't be misread.
   */
  deltaText: string;
  delay?: number;
}

const W = 220;
const H = 150;
const PAD_T = 22;
const PAD_B = 30;
const X1 = 34;
const X2 = W - 34;

export function MetricSlope({
  label,
  unit,
  before,
  after,
  min,
  max,
  format = (v) => String(v),
  beforeLabel = "before",
  afterLabel = "after",
  deltaText,
  delay = 0,
}: MetricSlopeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref as any, { once: true, margin: "-60px 0px" });
  const [hover, setHover] = useState<"before" | "after" | null>(null);

  const plotH = H - PAD_T - PAD_B;
  const y = (v: number) => PAD_T + plotH - ((v - min) / (max - min)) * plotH;
  const y1 = y(before);
  const y2 = y(after);

  const rising = after >= before;

  return (
    <div ref={ref} className="relative">
      <p className="text-[10px] font-semibold tracking-[0.14em] uppercase text-foreground/45 mb-1">
        {label}
      </p>
      {unit && (
        <p className="font-mono text-[10px] text-foreground/30 mb-2">{unit}</p>
      )}

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto overflow-visible"
        role="img"
        aria-label={`${label}: ${format(before)} ${beforeLabel} to ${format(after)} ${afterLabel}`}
      >
        {/* Recessive baseline rule — grid should never compete with the marks */}
        <line
          x1={X1} y1={PAD_T + plotH} x2={X2} y2={PAD_T + plotH}
          stroke="hsl(var(--data-grid))" strokeWidth="1"
        />

        {/* The slope itself, drawn on scroll */}
        <motion.line
          x1={X1} y1={y1} x2={X2} y2={y2}
          stroke="hsl(var(--data-1))"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={inView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 0.9, delay, ease: [0.23, 1, 0.32, 1] }}
        />

        {/* Endpoint markers — 2px surface ring so they read over the line */}
        <motion.circle
          cx={X1} cy={y1} r={hover === "before" ? 6.5 : 5}
          fill="hsl(var(--data-2))"
          stroke="hsl(var(--background))" strokeWidth="2"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: delay + 0.15 }}
          onMouseEnter={() => setHover("before")}
          onMouseLeave={() => setHover(null)}
          style={{ cursor: "pointer", transition: "r 0.15s" }}
        />
        <motion.circle
          cx={X2} cy={y2} r={hover === "after" ? 6.5 : 5}
          fill="hsl(var(--data-1))"
          stroke="hsl(var(--background))" strokeWidth="2"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: delay + 0.55 }}
          onMouseEnter={() => setHover("after")}
          onMouseLeave={() => setHover(null)}
          style={{ cursor: "pointer", transition: "r 0.15s" }}
        />

        {/* Direct labels — identity never rests on colour alone */}
        <motion.text
          x={X1} y={y1 - 12} textAnchor="middle"
          className="fill-foreground/70 font-mono"
          style={{ fontSize: 12, fontWeight: 500 }}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: delay + 0.2 }}
        >
          {format(before)}
        </motion.text>
        <motion.text
          x={X2} y={y2 - 12} textAnchor="middle"
          className="fill-foreground font-mono"
          style={{ fontSize: 13, fontWeight: 600 }}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: delay + 0.6 }}
        >
          {format(after)}
        </motion.text>

        {/* State labels on the axis */}
        <text
          x={X1} y={H - 10} textAnchor="middle"
          className="fill-foreground/35"
          style={{ fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase" }}
        >
          {beforeLabel}
        </text>
        <text
          x={X2} y={H - 10} textAnchor="middle"
          className="fill-foreground/35"
          style={{ fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase" }}
        >
          {afterLabel}
        </text>
      </svg>

      {/* Delta callout */}
      <motion.p
        className="font-mono text-[11px] mt-1"
        style={{ color: "hsl(var(--data-1))" }}
        initial={{ opacity: 0, y: 4 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: delay + 0.8 }}
      >
        {rising ? "▲" : "▼"} {deltaText}
      </motion.p>

      {/* Table fallback — every chart needs a non-visual reading */}
      <table className="sr-only">
        <caption>{label}</caption>
        <tbody>
          <tr><th scope="row">{beforeLabel}</th><td>{format(before)}</td></tr>
          <tr><th scope="row">{afterLabel}</th><td>{format(after)}</td></tr>
        </tbody>
      </table>
    </div>
  );
}
