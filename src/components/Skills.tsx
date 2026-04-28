"use client";

import { resumeData } from "@/config/resume-data";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { Scroll3DReveal } from "@/components/Scroll3DReveal";
import { SectionNumber } from "@/components/SectionNumber";
import { AnimatedDivider } from "@/components/AnimatedDivider";

export default function Skills() {
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.1, rootMargin: "-80px", triggerOnce: true });

  const maxItems = Math.max(...resumeData.skills.map(s => s.items.length));
  const getProficiency = (count: number) => Math.min(100, Math.max(70, (count / maxItems) * 30 + 70));

  return (
    <section id="skills" className="py-28 border-b border-foreground/8 relative overflow-hidden" ref={ref}>
      <SectionNumber number="03" />
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
              <div
                key={skillGroup.category}
                className={`transition-all duration-500 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                }`}
                style={{ transitionDelay: `${100 + index * 80}ms` }}
              >
                <h3 className="font-serif font-medium text-xl text-foreground mb-6">
                  {skillGroup.category}
                </h3>

                {/* Minimal 2px progress bar */}
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

                {/* Skill tags */}
                <div className="flex flex-wrap gap-1.5 mt-6">
                  {skillGroup.items.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 border border-foreground/12 text-[10px] font-semibold tracking-[0.1em] uppercase text-foreground/60 hover:border-primary hover:text-primary transition-all"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

      </div>
      <AnimatedDivider />
    </section>
  );
}
