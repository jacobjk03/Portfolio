"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { resumeData } from "@/config/resume-data";

/**
 * Skill map — the hero graphic.
 *
 * A small force-directed graph. Every node carries velocity and is pushed by
 * four forces: repulsion from its neighbours, spring tension along its links,
 * gravity toward its designed home position, and repulsion from the cursor.
 * Nodes can be grabbed and flung; the structure stretches and settles.
 *
 * Gravity pulls toward each node's *home* coordinate rather than a bare cluster
 * centre, which means the graph always relaxes back into the composition that
 * was designed for it instead of drifting into whatever the simulation prefers.
 * Physical to play with, stable to look at.
 *
 * The loop sleeps once kinetic energy drops below a threshold and wakes on
 * interaction, so an idle hero section isn't burning a core.
 *
 * HONEST NOTE ON THE DATA: the home coordinates are a deterministic seeded
 * layout derived from the category structure in resume-data.ts — NOT a real
 * projection of language-model embeddings. Swapping in genuine coordinates is a
 * drop-in: precompute embeddings offline, run UMAP/t-SNE, ship the xy pairs.
 */

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const VW = 520;
const VH = 520;

// ── Simulation constants ─────────────────────────────────────────────────────
const REPULSION = 300;      // node-node push
const MIN_DIST = 15;        // clamp so close pairs don't explode
const LINK_K = 0.020;       // spring stiffness along links
const HOME_K = 0.008;       // pull back to the designed position
const DAMPING = 0.90;       // velocity retained per frame
const FIELD_RADIUS = 128;   // cursor influence
const FIELD_STRENGTH = 2.6;
const SLEEP_SPEED = 0.015;  // below this (and idle) the loop parks itself
const MAX_SPEED = 9;

/**
 * Label lens. Hovering one dot at a time made finding a specific skill a
 * scavenger hunt, so every node within LENS_RADIUS of the cursor shows its name,
 * fading with distance. Capped at LENS_MAX nearest so a dense cluster reveals a
 * readable handful instead of a wall of overlapping text.
 */
const LENS_RADIUS = 92;
const LENS_MAX = 5;

const CENTERS: { x: number; y: number; label: string; labelDy: number }[] = [
  { x: 168, y: 168, label: "ML / AI", labelDy: -104 },
  { x: 388, y: 138, label: "Languages", labelDy: -62 },
  { x: 150, y: 372, label: "Frameworks", labelDy: -96 },
  { x: 378, y: 366, label: "Cloud & Tools", labelDy: -92 },
];

interface Node {
  x: number; y: number;
  vx: number; vy: number;
  hx: number; hy: number;   // home
  label: string;
  cluster: number;
  r: number;
}

export function SkillMap() {
  const [active, setActive] = useState<number | null>(null);
  const [hoverCluster, setHoverCluster] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);

  const svgRef = useRef<SVGSVGElement>(null);
  const groupRefs = useRef<(SVGGElement | null)[]>([]);
  const linkRefs = useRef<(SVGLineElement | null)[]>([]);
  // Caption groups (title + rule + count), repositioned by transform each frame.
  const labelRefs = useRef<(SVGGElement | null)[]>([]);

  const nodeLabelRefs = useRef<(SVGTextElement | null)[]>([]);
  // Mirrors of the hover state, read inside the rAF loop (which must not depend
  // on React re-renders to stay at 60fps).
  const activeRef = useRef<number | null>(null);
  const hoverClusterRef = useRef<number | null>(null);

  const sim = useRef<Node[]>([]);
  const pointer = useRef<{ x: number; y: number } | null>(null);
  const dragIdx = useRef<number | null>(null);
  const dragVel = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  const running = useRef(false);
  const engaged = useRef(false);

  const base = useMemo(() => {
    const rand = mulberry32(20260910);
    const out: { x: number; y: number; label: string; cluster: number; r: number }[] = [];

    resumeData.skills.forEach((cat, ci) => {
      const centre = CENTERS[ci % CENTERS.length];
      const items = cat.items.map((s) => (s.length > 22 ? s.split(" (")[0] : s));
      const spread = 16 + Math.sqrt(items.length) * 20;

      items.forEach((label, k) => {
        const angle = k * 2.39996 + rand() * 0.8;
        const radius = spread * Math.sqrt((k + 0.6) / items.length) + rand() * 9;
        out.push({
          x: centre.x + Math.cos(angle) * radius,
          y: centre.y + Math.sin(angle) * radius * 0.86,
          label,
          cluster: ci,
          r: 3.1 + rand() * 1.7,
        });
      });
    });
    return out;
  }, []);

  const links = useMemo(() => {
    const out: { a: number; b: number; rest: number; cluster: number }[] = [];
    for (let i = 0; i < base.length; i++) {
      for (let j = i + 1; j < base.length; j++) {
        if (base[i].cluster !== base[j].cluster) continue;
        const d = Math.hypot(base[i].x - base[j].x, base[i].y - base[j].y);
        if (d < 58) out.push({ a: i, b: j, rest: d, cluster: base[i].cluster });
      }
    }
    return out;
  }, [base]);

  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const toLocal = useCallback((clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return null;
    const rect = svg.getBoundingClientRect();
    return {
      x: ((clientX - rect.left) / rect.width) * VW,
      y: ((clientY - rect.top) / rect.height) * VH,
    };
  }, []);

  // ── The loop ───────────────────────────────────────────────────────────────
  const wake = useCallback(() => {
    if (running.current || reduced) return;
    running.current = true;

    const step = () => {
      const nodes = sim.current;
      const n = nodes.length;
      const p = pointer.current;

      // The link-spring pass iterates `links`, not `n`, so an empty sim would
      // dereference undefined nodes. wake() can fire from a state effect before
      // the init effect has populated sim.current — park and let init restart us.
      if (n === 0) {
        running.current = false;
        rafRef.current = null;
        return;
      }

      // Pairwise repulsion — 38 nodes is ~700 pairs, cheap enough to brute force.
      for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
          const a = nodes[i], b = nodes[j];
          let dx = b.x - a.x, dy = b.y - a.y;
          let d2 = dx * dx + dy * dy;
          if (d2 < 1e-6) { dx = 0.1; dy = 0.1; d2 = 0.02; }
          const d = Math.sqrt(d2);
          if (d > 120) continue;
          const f = REPULSION / Math.max(d2, MIN_DIST * MIN_DIST);
          const fx = (dx / d) * f, fy = (dy / d) * f;
          a.vx -= fx; a.vy -= fy;
          b.vx += fx; b.vy += fy;
        }
      }

      // Link springs
      for (const l of links) {
        const a = nodes[l.a], b = nodes[l.b];
        const dx = b.x - a.x, dy = b.y - a.y;
        const d = Math.hypot(dx, dy) || 0.001;
        const f = (d - l.rest) * LINK_K;
        const fx = (dx / d) * f, fy = (dy / d) * f;
        a.vx += fx; a.vy += fy;
        b.vx -= fx; b.vy -= fy;
      }

      let maxSpeed = 0;

      for (let i = 0; i < n; i++) {
        const node = nodes[i];

        // Home gravity — keeps the designed composition as the resting state.
        node.vx += (node.hx - node.x) * HOME_K;
        node.vy += (node.hy - node.y) * HOME_K;

        // Cursor field
        if (p && dragIdx.current === null) {
          const dx = node.x - p.x, dy = node.y - p.y;
          const d = Math.hypot(dx, dy);
          if (d < FIELD_RADIUS && d > 0.001) {
            const f = (1 - d / FIELD_RADIUS) ** 2 * FIELD_STRENGTH;
            node.vx += (dx / d) * f;
            node.vy += (dy / d) * f;
          }
        }

        if (i === dragIdx.current && p) {
          // Dragged node is pinned to the pointer; its motion still propagates
          // to neighbours through the springs.
          dragVel.current = { x: p.x - node.x, y: p.y - node.y };
          node.x = p.x; node.y = p.y;
          node.vx = 0; node.vy = 0;
        } else {
          node.vx *= DAMPING;
          node.vy *= DAMPING;
          const sp = Math.hypot(node.vx, node.vy);
          if (sp > MAX_SPEED) {
            node.vx = (node.vx / sp) * MAX_SPEED;
            node.vy = (node.vy / sp) * MAX_SPEED;
          }
          node.x += node.vx;
          node.y += node.vy;
          if (sp > maxSpeed) maxSpeed = sp;
        }

        const g = groupRefs.current[i];
        if (g) g.setAttribute("transform", `translate(${node.x.toFixed(2)},${node.y.toFixed(2)})`);
      }

      // ── Label lens ─────────────────────────────────────────────────────────
      // Rank nodes by distance to the cursor and reveal the nearest few.
      const act = activeRef.current;
      let ranked: { i: number; d: number }[] = [];
      if (p) {
        for (let i = 0; i < n; i++) {
          const d = Math.hypot(nodes[i].x - p.x, nodes[i].y - p.y);
          if (d < LENS_RADIUS) ranked.push({ i, d });
        }
        ranked.sort((u, v) => u.d - v.d);
        ranked = ranked.slice(0, LENS_MAX);

        // Highlight follows the nearest node, not the last hit-circle entered.
        // Driving it from hover handlers alone meant sweeping between nodes left
        // the previous cluster (or the idle tour's pick) lit while the lens was
        // reading out a different one — highlight and labels disagreed.
        // Refs are written first so repeated frames don't queue duplicate state.
        const nearIdx = ranked.length ? ranked[0].i : null;
        if (nearIdx !== activeRef.current) {
          activeRef.current = nearIdx;
          setActive(nearIdx);
        }
        const nearCluster = nearIdx !== null ? nodes[nearIdx].cluster : null;
        if (nearCluster !== hoverClusterRef.current) {
          hoverClusterRef.current = nearCluster;
          setHoverCluster(nearCluster);
        }
      }
      const lens = new Map(ranked.map((r) => [r.i, r.d]));

      for (let i = 0; i < n; i++) {
        const el = nodeLabelRefs.current[i];
        if (!el) continue;

        let opacity = 0;
        let weight = 400;

        const d = lens.get(i);
        if (d !== undefined) {
          // Nearest is fully legible; the rest fade out with distance.
          opacity = Math.max(0.28, 1 - (d / LENS_RADIUS) * 0.95);
          if (ranked.length && ranked[0].i === i) { opacity = 1; weight = 500; }
        }

        // Priority order matters. While the cursor is in the map the lens is the
        // only thing driving labels — otherwise the idle tour's last pick stayed
        // pinned at full opacity on the far side of the graph. The tour only
        // labels its node when there's no pointer to speak for the visitor.
        if (dragIdx.current === i) { opacity = 1; weight = 500; }
        else if (!p && i === act) { opacity = 1; weight = 500; }

        el.style.opacity = String(opacity);
        el.style.fontWeight = String(weight);
      }

      // Links follow live positions
      for (let k = 0; k < links.length; k++) {
        const el = linkRefs.current[k];
        if (!el) continue;
        const a = nodes[links[k].a], b = nodes[links[k].b];
        el.setAttribute("x1", a.x.toFixed(2));
        el.setAttribute("y1", a.y.toFixed(2));
        el.setAttribute("x2", b.x.toFixed(2));
        el.setAttribute("y2", b.y.toFixed(2));
      }

      // Cluster captions ride their group's centroid
      for (let c = 0; c < CENTERS.length; c++) {
        const el = labelRefs.current[c];
        if (!el) continue;
        let sx = 0, sy = 0, count = 0;
        for (let i = 0; i < n; i++) {
          if (nodes[i].cluster === c) { sx += nodes[i].x; sy += nodes[i].y; count++; }
        }
        if (!count) continue;
        // The caption is a <g> (text + rule + count), so it moves by transform.
        el.setAttribute(
          "transform",
          `translate(${(sx / count).toFixed(2)},${(sy / count + CENTERS[c].labelDy).toFixed(2)})`
        );
      }

      const idle = !p && dragIdx.current === null;
      if (idle && maxSpeed < SLEEP_SPEED) {
        running.current = false;   // park until something happens
        rafRef.current = null;
        return;
      }
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
  }, [links, reduced]);

  // ── Init: scatter, then let the simulation pull it together ────────────────
  useEffect(() => {
    const rand = mulberry32(7788);
    sim.current = base.map((b) => {
      const a0 = rand() * Math.PI * 2;
      const d0 = 70 + rand() * 150;
      return {
        x: reduced ? b.x : VW / 2 + Math.cos(a0) * d0,
        y: reduced ? b.y : VH / 2 + Math.sin(a0) * d0,
        vx: 0, vy: 0,
        hx: b.x, hy: b.y,
        label: b.label,
        cluster: b.cluster,
        r: b.r,
      };
    });
    if (!reduced) wake();
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      running.current = false;
    };
  }, [base, reduced, wake]);

  // Keep the loop's mirrors in step with the rendered hover state.
  // wake() matters here: the loop parks itself when idle, and the idle tour
  // changes `active` while parked — without a nudge its label never appears.
  useEffect(() => { activeRef.current = active; wake(); }, [active, wake]);
  useEffect(() => { hoverClusterRef.current = hoverCluster; wake(); }, [hoverCluster, wake]);

  // ── Idle tour ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (reduced || base.length === 0) return;
    let i = Math.floor(base.length * 0.35);
    const id = setInterval(() => {
      if (engaged.current) return;
      i = (i + 7) % base.length;
      setActive(i);
      setHoverCluster(base[i].cluster);
    }, 2300);
    return () => clearInterval(id);
  }, [base, reduced]);

  // ── Pointer ────────────────────────────────────────────────────────────────
  const onPointerMove = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    const p = toLocal(e.clientX, e.clientY);
    if (!p) return;
    pointer.current = p;
    wake();
  }, [toLocal, wake]);

  const onPointerLeave = useCallback(() => {
    pointer.current = null;
    dragIdx.current = null;
    engaged.current = false;
    setDragging(false);
    setActive(null);
    setHoverCluster(null);
    // Explicit nudge: if the loop is already parked and the state above is
    // unchanged, no effect fires and the lens labels stay stuck on screen.
    wake();
  }, [wake]);

  const onPointerUp = useCallback(() => {
    if (dragIdx.current !== null) {
      const node = sim.current[dragIdx.current];
      // Hand the pointer's motion to the node so a quick flick actually flings it.
      if (node) {
        node.vx = dragVel.current.x * 0.9;
        node.vy = dragVel.current.y * 0.9;
      }
      dragIdx.current = null;
      setDragging(false);
      wake();
    }
  }, [wake]);

  const startDrag = useCallback((i: number, e: React.PointerEvent) => {
    e.stopPropagation();
    (e.target as Element).setPointerCapture?.(e.pointerId);
    dragIdx.current = i;
    engaged.current = true;
    setDragging(true);
    setActive(i);
    setHoverCluster(sim.current[i]?.cluster ?? null);
    wake();
  }, [wake]);

  return (
    <div className="relative w-full max-w-[560px] mx-auto select-none">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VW} ${VH}`}
        className="w-full h-auto overflow-visible"
        style={{ cursor: dragging ? "grabbing" : "default", touchAction: "none" }}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        onPointerUp={onPointerUp}
        onPointerEnter={() => { engaged.current = true; }}
        role="img"
        aria-label="An interactive force-directed map of Jacob's skills, grouped by category"
      >
        {/* Projection frame */}
        <g stroke="currentColor" className="text-foreground/15" strokeWidth="1" fill="none">
          <path d="M 18 46 L 18 18 L 46 18" />
          <path d={`M ${VW - 46} 18 L ${VW - 18} 18 L ${VW - 18} 46`} />
          <path d={`M 18 ${VH - 46} L 18 ${VH - 18} L 46 ${VH - 18}`} />
          <path d={`M ${VW - 46} ${VH - 18} L ${VW - 18} ${VH - 18} L ${VW - 18} ${VH - 46}`} />
        </g>
        {/* Links */}
        <g>
          {links.map((l, i) => (
            <line
              key={i}
              ref={(el) => { linkRefs.current[i] = el; }}
              x1={base[l.a].x} y1={base[l.a].y}
              x2={base[l.b].x} y2={base[l.b].y}
              stroke={hoverCluster === l.cluster ? "hsl(var(--primary))" : "currentColor"}
              strokeWidth={hoverCluster === l.cluster ? 0.9 : 0.5}
              className="text-foreground/15 transition-colors duration-300"
              style={{ opacity: hoverCluster === null || hoverCluster === l.cluster ? 1 : 0.25 }}
            />
          ))}
        </g>

        {/* Cluster captions. Plain text — just weighted and opaque enough to
            read as headings at rest, rather than needing a rule or a count to
            carry them. */}
        {CENTERS.slice(0, resumeData.skills.length).map((c, i) => {
          const on = hoverCluster === i;
          return (
            <g
              key={c.label}
              ref={(el) => { labelRefs.current[i] = el; }}
              transform={`translate(${c.x},${c.y + c.labelDy})`}
            >
              <text
                x={0} y={0}
                textAnchor="middle"
                className="font-mono transition-all duration-300"
                style={{
                  fontSize: 10,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  fontWeight: on ? 600 : 500,
                  fill: on ? "hsl(var(--primary))" : "hsl(var(--foreground))",
                  fillOpacity: on ? 1 : hoverCluster === null ? 0.72 : 0.4,
                }}
              >
                {c.label}
              </text>
            </g>
          );
        })}

        {/* Nodes — positioned by transform so children stay local */}
        {base.map((p, i) => {
          const dim = hoverCluster !== null && hoverCluster !== p.cluster;
          const isActive = active === i;
          return (
            <g
              key={p.label + i}
              ref={(el) => { groupRefs.current[i] = el; }}
              transform={`translate(${p.x},${p.y})`}
            >
              {/* Hit area is for grabbing only. Hover highlighting is driven by
                  the lens in the animation loop — two sources of truth for the
                  same highlight is exactly what made it inconsistent. */}
              <circle
                cx={0} cy={0} r={15}
                fill="transparent"
                style={{ cursor: dragging ? "grabbing" : "grab" }}
                onPointerDown={(e) => startDrag(i, e)}
              />
              <circle
                cx={0} cy={0} r={isActive ? p.r + 2.4 : p.r}
                className="transition-all duration-300 pointer-events-none"
                style={{
                  fill: isActive || hoverCluster === p.cluster ? "hsl(var(--primary))" : "currentColor",
                  color: "hsl(var(--foreground))",
                  opacity: dim ? 0.16 : isActive ? 1 : 0.58,
                }}
              />
              {/* Always mounted; the lens drives opacity imperatively so
                  revealing labels never costs a React re-render. */}
              <text
                ref={(el) => { nodeLabelRefs.current[i] = el; }}
                x={0} y={-13}
                textAnchor="middle"
                className="font-mono pointer-events-none"
                style={{
                  fontSize: 11,
                  fill: "hsl(var(--foreground))",
                  opacity: 0,
                  transition: "opacity 0.18s ease",
                  paintOrder: "stroke",
                  stroke: "hsl(var(--background))",
                  strokeWidth: 3.5,
                  strokeLinejoin: "round",
                }}
              >
                {p.label}
              </text>
            </g>
          );
        })}
      </svg>

      <p className="text-center font-mono text-[9px] tracking-[0.16em] uppercase text-foreground/25 mt-2">
        drag a node · or sweep your cursor through
      </p>
    </div>
  );
}
