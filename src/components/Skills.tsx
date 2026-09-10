"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { resumeData } from "@/config/resume-data";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { Scroll3DReveal } from "@/components/Scroll3DReveal";
import { SectionNumber } from "@/components/SectionNumber";
import { AnimatedDivider } from "@/components/AnimatedDivider";
import { ScrollTiltSection } from "@/components/ScrollTiltSection";
import { SkillDiagram, type DiagramKind } from "@/components/SkillDiagram";

/**
 * Diagram per headline skill, in the same order as resumeData.headlineSkills.
 * Kept here rather than in the data file so the content stays free of
 * presentation concerns — reorder the skills and update this to match.
 */
const DIAGRAMS: DiagramKind[] = [
  "finetune",  // LLM Fine-Tuning
  "forecast",  // Time Series Forecasting
  "rag",       // RAG
  "agents",    // Multi-Agent Systems
  "nlp",       // NLP
  "cloud",     // AWS
];

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function ScrambleTag({ text, trigger, delay }: { text: string; trigger: boolean; delay: number }) {
  const [display, setDisplay] = useState(text);
  const hasRun = useRef(false);

  useEffect(() => {
    if (!trigger || hasRun.current) return;
    hasRun.current = true;
    const timeout = setTimeout(() => {
      let frame = 0;
      const totalFrames = Math.min(Math.ceil(text.length * 2.2), 48);
      const interval = setInterval(() => {
        if (frame >= totalFrames) {
          setDisplay(text);
          clearInterval(interval);
          return;
        }
        const revealUpTo = (frame / totalFrames) * text.length;
        setDisplay(
          text.split("").map((char, i) => {
            if (char === " " || char === "." || char === "+" || char === "#" || char === "/") return char;
            if (i < revealUpTo) return char;
            return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
          }).join("")
        );
        frame++;
      }, 28);
    }, delay);
    return () => clearTimeout(timeout);
  }, [trigger, text, delay]);

  return <>{display}</>;
}

export default function Skills() {
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.1, rootMargin: "-80px", triggerOnce: true });
  const [expanded, setExpanded] = useState(false);

  const totalSkills = resumeData.skills.reduce((n, g) => n + g.items.length, 0);
  const restCount = totalSkills - resumeData.headlineSkills.length;

  // NOTE: this section used to render a "Proficiency %" bar per category. The
  // number was computed as (items / maxItems) * 30 + 70 — purely a function of
  // how many tags were listed, measuring nothing about actual skill. Listing one
  // more library raised the "proficiency". Invented precision like that is worse
  // than no number at all on a data portfolio, so it's gone.

  return (
    <section id="skills" className="py-28 border-b border-foreground/8 relative overflow-hidden" ref={ref}>
      <SectionNumber number="02" />
      <ScrollTiltSection>
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-20">

        <div className="mb-14">
          <Scroll3DReveal>
            <span className="editorial-label block mb-4">Core Competencies</span>
            <h2 className="font-serif font-medium text-3xl md:text-4xl text-foreground">
              What I build with.
            </h2>
          </Scroll3DReveal>
        </div>

        {/* Headline set as cards, each led by a looping diagram of the actual
            mechanism. A visitor skimming for ten seconds reads pictures, not a
            list of nouns — and the Results section already owns the numbers, so
            repeating metrics here would just make a second scoreboard. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-foreground/10 mb-10 border border-foreground/10">
          {resumeData.headlineSkills.map((skill, i) => (
            <motion.div
              key={skill.name}
              className="group bg-background p-6 hover:bg-secondary/30 transition-colors duration-300"
              initial={{ opacity: 0, y: 14 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.05 + i * 0.07, ease: [0.23, 1, 0.32, 1] }}
            >
              {/* Fixed, small height — the diagram is a glyph for the skill,
                  not a chart to study. */}
              <div className="h-[68px] flex items-center justify-center mb-4">
                <SkillDiagram kind={DIAGRAMS[i % DIAGRAMS.length]} active={isVisible} />
              </div>
              <h3 className="font-serif font-medium text-lg text-foreground leading-tight text-center group-hover:text-primary transition-colors duration-300">
                {skill.name}
              </h3>
            </motion.div>
          ))}
        </div>

        <button
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          aria-controls="skills-full-list"
          className="flex items-center gap-2 text-[10px] font-semibold tracking-[0.14em] uppercase text-primary hover:underline underline-offset-4 mb-6"
        >
          {expanded ? "Show less" : `+ ${restCount} more`}
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
          />
        </button>

        {/* The full list is ALWAYS rendered — collapsing it out of the DOM would
            break find-in-page, screen readers and indexing, which is most of the
            reason this section exists alongside the hero skill map. It's only
            visually collapsed. */}
        <div
          id="skills-full-list"
          className="overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]"
          style={{
            maxHeight: expanded ? 900 : 0,
            opacity: expanded ? 1 : 0,
          }}
        >
        {/* Rows, not columns. Four columns of uneven length left large gaps
            under the short ones; a label-left / tags-right row fills the width
            evenly and roughly halves the section's height. */}
        <div className="border-t border-foreground/10">
          {resumeData.skills.map((skillGroup, index) => (
            <motion.div
              key={skillGroup.category}
              className={`grid lg:grid-cols-12 gap-x-8 gap-y-2 py-4 border-b border-foreground/10 transition-opacity duration-500 ${
                isVisible ? "opacity-100" : "opacity-0"
              }`}
              style={{ transitionDelay: `${100 + index * 80}ms` }}
            >
              {/* Narrow label column — every column given to the labels is one
                  taken from the tags, which forces them to wrap onto more rows. */}
              <div className="lg:col-span-2 flex items-baseline gap-2">
                <h3 className="font-serif font-medium text-base text-foreground leading-tight">
                  {skillGroup.category}
                </h3>
                <span className="font-mono text-[10px] text-foreground/30">
                  {skillGroup.items.length}
                </span>
              </div>

              <motion.div
                className="lg:col-span-10 flex flex-wrap gap-1.5 content-start"
                variants={{
                  hidden: {},
                  show: { transition: { staggerChildren: 0.03, delayChildren: 0.14 + index * 0.07 } },
                }}
                initial="hidden"
                animate={isVisible ? "show" : "hidden"}
              >
                {skillGroup.items.map((skill, i) => (
                  <motion.span
                    key={skill}
                    variants={{
                      hidden: { opacity: 0, y: 8 },
                      show: { opacity: 1, y: 0 },
                    }}
                    transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                    className="px-2.5 py-1 border border-foreground/12 text-[10px] font-semibold tracking-[0.1em] uppercase text-foreground/60 hover:border-primary hover:text-primary transition-colors cursor-default"
                  >
                    <ScrambleTag
                      text={skill}
                      trigger={isVisible}
                      delay={180 + index * 70 + i * 30}
                    />
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>
          ))}
        </div>
        </div>

      </div>
      </ScrollTiltSection>
      <AnimatedDivider />
    </section>
  );
}
