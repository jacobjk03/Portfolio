"use client";

import { ReactNode, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { resumeData } from "@/config/resume-data";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { Scroll3DReveal } from "@/components/Scroll3DReveal";
import { SectionNumber } from "@/components/SectionNumber";
import { AnimatedDivider } from "@/components/AnimatedDivider";
import { ScrollTiltSection } from "@/components/ScrollTiltSection";

// ── Option A: timeline column wrapper ─────────────────────────────────────────
function TimelineColumn({
  children,
  isVisible,
  lineDelay = 0,
}: {
  children: ReactNode;
  isVisible: boolean;
  lineDelay?: number;
}) {
  return (
    <div className="relative">
      {/* Drawing vertical line */}
      <div className="absolute left-[15px] top-4 bottom-4 w-px overflow-hidden">
        <motion.div
          className="w-full bg-foreground/18"
          style={{ height: "100%", transformOrigin: "top" }}
          initial={{ scaleY: 0 }}
          animate={isVisible ? { scaleY: 1 } : {}}
          transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1], delay: lineDelay }}
        />
      </div>
      {/* Entries indented past the line */}
      <div className="pl-9 space-y-14">{children}</div>
    </div>
  );
}

// ── Option A: diamond marker ───────────────────────────────────────────────────
function DiamondMarker({ isVisible, delay }: { isVisible: boolean; delay: number }) {
  return (
    <motion.div
      className="absolute bg-background border border-primary"
      style={{
        width: 10,
        height: 10,
        top: 6,
        left: -26,   // entry left (36px pl-9) − 26px = 10px from container left
        rotate: "45deg",
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={isVisible ? { scale: 1, opacity: 1 } : {}}
      transition={{ delay, type: "spring", stiffness: 320, damping: 18 }}
    />
  );
}

// ── Bullet list with staggered cascade (Option C) ────────────────────────────
function BulletList({
  items,
  isVisible,
  baseDelay,
}: {
  items: string[];
  isVisible: boolean;
  baseDelay: number;
}) {
  return (
    <motion.ul
      className="space-y-2 mb-5"
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.075, delayChildren: baseDelay } },
      }}
      initial="hidden"
      animate={isVisible ? "show" : "hidden"}
    >
      {items.map((desc, i) => (
        <motion.li
          key={i}
          variants={{
            hidden: { opacity: 0, x: -10 },
            show: { opacity: 1, x: 0 },
          }}
          transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
          className="text-sm text-muted-foreground flex gap-3 leading-relaxed"
        >
          <span className="text-primary mt-1.5 shrink-0">—</span>
          <span>{desc}</span>
        </motion.li>
      ))}
    </motion.ul>
  );
}

// ── Tech tags with staggered cascade (Option C) ──────────────────────────────
function TagList({
  tags,
  isVisible,
  baseDelay,
}: {
  tags: string[];
  isVisible: boolean;
  baseDelay: number;
}) {
  return (
    <motion.div
      className="flex flex-wrap gap-1.5"
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.045, delayChildren: baseDelay } },
      }}
      initial="hidden"
      animate={isVisible ? "show" : "hidden"}
    >
      {tags.map((tech) => (
        <motion.span
          key={tech}
          variants={{
            hidden: { opacity: 0, y: 6 },
            show: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.22 }}
          className="px-2 py-0.5 border border-foreground/12 text-[10px] font-semibold tracking-[0.08em] uppercase text-foreground/50"
        >
          {tech}
        </motion.span>
      ))}
    </motion.div>
  );
}

// ── Per-entry observer so each item reveals when it scrolls into view ─────────
function TimelineEntry({ children }: { children: (isVisible: boolean) => ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref as any, { once: true, margin: "-80px 0px" });
  return <div ref={ref} className="relative">{children(isInView)}</div>;
}

// ─────────────────────────────────────────────────────────────────────────────

export default function Experience() {
  const { ref, isVisible } = useIntersectionObserver({
    threshold: 0.05,
    rootMargin: "-60px",
    triggerOnce: true,
  });

  return (
    <section
      id="experience"
      className="py-28 border-b border-foreground/8 relative overflow-hidden"
      ref={ref}
    >
      <SectionNumber number="03" />
      <ScrollTiltSection>
        <div className="max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-20">

          <div className="mb-20">
            <Scroll3DReveal>
              <span className="editorial-label block mb-4">Background</span>
              <h2 className="font-serif font-medium text-3xl md:text-4xl text-foreground">
                Experience & Education
              </h2>
            </Scroll3DReveal>
          </div>

          <div className="grid lg:grid-cols-2 gap-0">

            {/* ── Experience (left) ── */}
            <div className="lg:pr-16 lg:border-r border-foreground/10">
              <span className="editorial-label block mb-10">Experience</span>
              <TimelineColumn isVisible={isVisible} lineDelay={0.2}>
                {resumeData.experience.map((exp, index) => (
                  <TimelineEntry key={index}>
                    {(entryVisible) => (
                      <>
                        <DiamondMarker isVisible={entryVisible} delay={0.1} />
                        <motion.div
                          initial={{ opacity: 0, y: 14 }}
                          animate={entryVisible ? { opacity: 1, y: 0 } : {}}
                          transition={{ duration: 0.45, delay: 0.05 }}
                        >
                          <span className="text-[10px] font-semibold tracking-[0.15em] uppercase text-foreground/35 block mb-2">
                            {exp.startDate} — {exp.endDate}
                          </span>
                          <h4 className="font-serif font-medium text-xl text-foreground mb-1">
                            {exp.position}
                          </h4>
                          <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-primary mb-4">
                            {exp.company} · {exp.location}
                          </p>
                          <BulletList items={exp.description} isVisible={entryVisible} baseDelay={0.15} />
                          {exp.technologies && (
                            <TagList tags={exp.technologies} isVisible={entryVisible} baseDelay={0.25} />
                          )}
                        </motion.div>
                      </>
                    )}
                  </TimelineEntry>
                ))}
              </TimelineColumn>
            </div>

            {/* ── Education (right) ── */}
            <div className="lg:pl-16 mt-16 lg:mt-0">
              <span className="editorial-label block mb-10">Education</span>
              <TimelineColumn isVisible={isVisible} lineDelay={0.35}>
                {resumeData.education.map((edu, index) => (
                  <TimelineEntry key={index}>
                    {(entryVisible) => (
                      <>
                        <DiamondMarker isVisible={entryVisible} delay={0.1} />
                        <motion.div
                          initial={{ opacity: 0, y: 14 }}
                          animate={entryVisible ? { opacity: 1, y: 0 } : {}}
                          transition={{ duration: 0.45, delay: 0.05 }}
                        >
                          <span className="text-[10px] font-semibold tracking-[0.15em] uppercase text-foreground/35 block mb-2">
                            {edu.startDate} — {edu.endDate}
                          </span>
                          <h4 className="font-serif font-medium text-xl text-foreground mb-1">
                            {edu.degree}
                          </h4>
                          <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-primary mb-4">
                            {edu.institution} · {edu.location}
                          </p>
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={entryVisible ? { opacity: 1 } : {}}
                            transition={{ delay: 0.2, duration: 0.4 }}
                          >
                            <p className="text-sm text-muted-foreground mb-2">
                              <span className="font-medium text-foreground/70">Field: </span>
                              {edu.field}
                            </p>
                            {edu.gpa && (
                              <p className="text-sm text-muted-foreground mb-4">
                                <span className="font-medium text-foreground/70">GPA: </span>
                                {edu.gpa}
                              </p>
                            )}
                          </motion.div>
                          {edu.achievements && edu.achievements.length > 0 && (
                            <BulletList items={edu.achievements} isVisible={entryVisible} baseDelay={0.25} />
                          )}
                        </motion.div>
                      </>
                    )}
                  </TimelineEntry>
                ))}
              </TimelineColumn>
            </div>

          </div>
        </div>
      </ScrollTiltSection>
      <AnimatedDivider />
    </section>
  );
}
