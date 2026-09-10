"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { resumeData } from "@/config/resume-data";

/**
 * An animated Thought → Action → Observation trace.
 *
 * The medical chatbot's whole point is that reasoning is explicit rather than a
 * black box, so the section shows the loop running instead of describing it.
 *
 * The steps below are representative of the ReAct loop the project implements
 * (LangGraph StateGraph, Pinecone retrieval, CrossEncoder rerank, DuckDuckGo
 * fallback, Groq safety classifier) — they're an illustration of the mechanism,
 * not a captured production log.
 */

type Kind = "thought" | "action" | "observation" | "answer";

interface Step {
  kind: Kind;
  text: string;
}

const STEPS: Step[] = [
  { kind: "thought", text: "Question is clinical — check the verified corpus first." },
  { kind: "action", text: 'pinecone.search("…", top_k=8)' },
  { kind: "observation", text: "8 passages · reranked by CrossEncoder → 3 kept" },
  { kind: "thought", text: "Grounded but dated. Look for current guidance." },
  { kind: "action", text: 'web.search(domains=[who.int, nih.gov, cdc.gov])' },
  { kind: "observation", text: "2 sources retrieved · recency confirmed" },
  { kind: "thought", text: "Enough evidence to answer. Route through safety." },
  { kind: "answer", text: "Response cleared by classifier · sources cited" },
];

const KIND_LABEL: Record<Kind, string> = {
  thought: "THOUGHT",
  action: "ACTION",
  observation: "OBSERVATION",
  answer: "ANSWER",
};

/**
 * `showAttribution` is off when the panel sits inside the featured block, where
 * the project title already appears alongside it — repeating it there just reads
 * as a duplicated heading.
 */
export function ReasoningTrace({ showAttribution = true }: { showAttribution?: boolean } = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref as any, { once: true, margin: "-80px 0px" });
  const [visible, setVisible] = useState(0);

  // Attribution comes from the project list so the panel can never drift out of
  // sync with the card below it.
  const project = resumeData.projects.find((p) => /medical/i.test(p.title));

  useEffect(() => {
    if (!inView) return;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      setVisible(STEPS.length);
      return;
    }

    // Step the trace forward; hold on the final answer.
    const timers: ReturnType<typeof setTimeout>[] = [];
    STEPS.forEach((_, i) => {
      timers.push(setTimeout(() => setVisible(i + 1), 400 + i * 620));
    });
    return () => timers.forEach(clearTimeout);
  }, [inView]);

  return (
    <div
      ref={ref}
      className="border border-foreground/10 bg-secondary/20 p-6 md:p-8"
    >
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.16em] uppercase text-primary">
            Agent trace
          </p>
          <p className="font-serif text-lg text-foreground mt-1 leading-snug">
            Reasoning you can inspect.
          </p>
          {/* Names the project this trace belongs to — without it the panel
              reads as a generic demo unattached to any of the work below. */}
          {showAttribution && project && (
            <p className="text-[11px] text-muted-foreground mt-1.5">
              from{" "}
              {project.link ? (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground/80 hover:text-primary underline underline-offset-2 decoration-foreground/25 hover:decoration-primary transition-colors inline-flex items-center gap-0.5"
                >
                  {project.title}
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              ) : (
                <span className="text-foreground/80">{project.title}</span>
              )}
            </p>
          )}
        </div>
        <p className="font-mono text-[10px] text-foreground/35 shrink-0">
          ReAct loop · LangGraph StateGraph
        </p>
      </div>

      <ol className="space-y-2.5">
        {STEPS.map((s, i) => {
          const shown = i < visible;
          return (
            <motion.li
              key={i}
              className="flex gap-3 items-start"
              initial={{ opacity: 0, x: -6 }}
              animate={shown ? { opacity: 1, x: 0 } : { opacity: 0, x: -6 }}
              transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
            >
              <span
                className="font-mono text-[9px] tracking-[0.1em] pt-[3px] shrink-0 w-[86px]"
                style={{
                  color:
                    s.kind === "answer" || s.kind === "action"
                      ? "hsl(var(--primary))"
                      : "hsl(var(--foreground) / 0.38)",
                }}
              >
                {KIND_LABEL[s.kind]}
              </span>
              <span
                className={`text-[12.5px] leading-relaxed ${
                  s.kind === "action"
                    ? "font-mono text-foreground/75"
                    : "text-muted-foreground"
                } ${s.kind === "answer" ? "text-foreground font-medium" : ""}`}
              >
                {s.text}
              </span>
            </motion.li>
          );
        })}
      </ol>

      {/* Caret sits at the frontier of the trace while it plays */}
      {visible < STEPS.length && (
        <span className="inline-block w-[7px] h-[13px] bg-primary/60 mt-3 animate-pulse" />
      )}
    </div>
  );
}
