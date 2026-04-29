"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { resumeData } from "@/config/resume-data";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { Scroll3DReveal } from "@/components/Scroll3DReveal";
import { SectionNumber } from "@/components/SectionNumber";
import { AnimatedDivider } from "@/components/AnimatedDivider";
import { ScrollTiltSection } from "@/components/ScrollTiltSection";

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

  const maxItems = Math.max(...resumeData.skills.map(s => s.items.length));
  const getProficiency = (count: number) => Math.min(100, Math.max(70, (count / maxItems) * 30 + 70));

  return (
    <section id="skills" className="py-28 border-b border-foreground/8 relative overflow-hidden" ref={ref}>
      <SectionNumber number="02" />
      <ScrollTiltSection>
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-20">

        <div className="mb-20">
          <Scroll3DReveal>
            <span className="editorial-label block mb-4">Core Competencies</span>
            <h2 className="font-serif font-medium text-3xl md:text-4xl text-foreground">
              Skills & Expertise
            </h2>
          </Scroll3DReveal>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          {resumeData.skills.map((skillGroup, index) => {
            const proficiency = getProficiency(skillGroup.items.length);
            return (
              <motion.div
                key={skillGroup.category}
                className={`transition-opacity duration-500 ${isVisible ? "opacity-100" : "opacity-0"}`}
                style={{ transitionDelay: `${100 + index * 80}ms` }}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 380, damping: 22 }}
              >
                <h3 className="font-serif font-medium text-xl text-foreground mb-6">
                  {skillGroup.category}
                </h3>

                {/* Amber progress bar */}
                <div className="mb-1">
                  <div className="flex justify-between text-[10px] font-semibold tracking-[0.12em] uppercase text-foreground/40 mb-2">
                    <span>Proficiency</span>
                    <span>{Math.round(proficiency)}%</span>
                  </div>
                  <div className="skill-bar">
                    <div
                      className="skill-progress"
                      style={{ width: isVisible ? `${proficiency}%` : "0%", transitionDelay: `${300 + index * 80}ms` }}
                    />
                  </div>
                </div>

                {/* Skill tags — staggered cascade + scramble decode on entry */}
                <motion.div
                  className="flex flex-wrap gap-1.5 mt-6"
                  variants={{
                    hidden: {},
                    show: { transition: { staggerChildren: 0.045, delayChildren: 0.18 + index * 0.09 } },
                  }}
                  initial="hidden"
                  animate={isVisible ? "show" : "hidden"}
                >
                  {skillGroup.items.map((skill, i) => (
                    <motion.span
                      key={skill}
                      variants={{
                        hidden: { opacity: 0, y: 10, scale: 0.86 },
                        show: { opacity: 1, y: 0, scale: 1 },
                      }}
                      transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
                      className="px-2.5 py-1 border border-foreground/12 text-[10px] font-semibold tracking-[0.1em] uppercase text-foreground/60 hover:border-primary hover:text-primary transition-colors cursor-default"
                    >
                      <ScrambleTag
                        text={skill}
                        trigger={isVisible}
                        delay={220 + index * 90 + i * 42}
                      />
                    </motion.span>
                  ))}
                </motion.div>
              </motion.div>
            );
          })}
        </div>

      </div>
      </ScrollTiltSection>
      <AnimatedDivider />
    </section>
  );
}
