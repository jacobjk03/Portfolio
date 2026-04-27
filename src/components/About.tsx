"use client";

import { useState, useEffect } from "react";
import { resumeData } from "@/config/resume-data";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { Scroll3DReveal } from "@/components/Scroll3DReveal";
import { SectionNumber } from "@/components/SectionNumber";

function useCountUp(target: number, isVisible: boolean, duration = 1200) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!isVisible) return;
    let start = 0;
    const steps = Math.ceil(duration / 16);
    const increment = target / steps;
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isVisible, target, duration]);
  return count;
}

export default function About() {
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.1, rootMargin: "-80px", triggerOnce: true });

  const rawStats = [
    { raw: resumeData.experience.length, label: "Roles & Internships" },
    { raw: resumeData.projects.length, label: "Projects Built" },
    { raw: resumeData.skills.reduce((acc, s) => acc + s.items.length, 0), label: "Technologies" },
    { raw: resumeData.certifications?.length || 0, label: "Certifications" },
  ];

  const c0 = useCountUp(rawStats[0].raw, isVisible, 900);
  const c1 = useCountUp(rawStats[1].raw, isVisible, 1000);
  const c2 = useCountUp(rawStats[2].raw, isVisible, 1200);
  const c3 = useCountUp(rawStats[3].raw, isVisible, 1050);
  const counts = [c0, c1, c2, c3];

  return (
    <section id="about" className="py-28 border-b border-foreground/8 relative overflow-hidden" ref={ref}>
      {/* Section number */}
      <SectionNumber number="02" />
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-20">
        <div className="grid lg:grid-cols-12 gap-16 items-start">

          {/* Portrait — left column */}
          <div
            className={`lg:col-span-5 relative transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="aspect-[3/4] overflow-hidden relative group">
              {resumeData.personal.avatar ? (
                <img
                  src={resumeData.personal.avatar}
                  alt={resumeData.personal.name}
                  className="w-full h-full object-cover transition-all duration-700"
                />
              ) : (
                <div className="w-full h-full bg-secondary flex items-center justify-center">
                  <span className="text-8xl">👨‍💻</span>
                </div>
              )}
              {/* border overlay */}
              <div className="absolute inset-0 border border-foreground/10 group-hover:border-primary/30 transition-colors duration-500 pointer-events-none" />
            </div>
            {/* Corner bracket decoration */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 border-r border-b border-foreground/10 pointer-events-none" />
          </div>

          {/* Bio + Stats — right column */}
          <div className="lg:col-span-7 lg:col-start-6">
            <div
              className={`transition-all duration-700 delay-150 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <Scroll3DReveal>
                <span className="editorial-label block mb-8">About</span>
                <h2 className="font-serif font-medium text-3xl md:text-4xl text-foreground mb-8 leading-tight">
                  Structured inquiry.<br />Scalable impact.
                </h2>
              </Scroll3DReveal>

              <div className="space-y-5 mb-12 text-base text-muted-foreground leading-relaxed">
                <p>
                  I build AI that thinks, plans, and acts — not just responds.
                  My focus is <strong className="text-foreground font-medium">Agentic AI</strong> and{" "}
                  <strong className="text-foreground font-medium">RAG systems</strong> powered by memory,
                  tool-use, and multi-step reasoning.
                </p>
                <p>
                  I ship production-ready LLM applications on{" "}
                  <strong className="text-foreground font-medium">AWS</strong>, architected for speed,
                  reliability, and enterprise scale. Blending research and engineering, I design AI agents
                  you can trust — from real-time decision systems to voice-enabled assistants.
                </p>
                <p>
                  Currently at{" "}
                  <strong className="text-foreground font-medium">Arizona State University</strong>, focused
                  on cloud-native AI systems and next-gen autonomous intelligence.
                </p>
              </div>

              {/* Location badge */}
              <div className="flex items-center gap-6 mb-12 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <span>📍</span>
                  {resumeData.personal.location}
                </span>
                <span className="flex items-center gap-2">
                  <span>💼</span>
                  Available for work
                </span>
              </div>

              {/* Stats grid — animated count-up */}
              <div className="grid grid-cols-2 gap-0">
                {rawStats.map((stat, i) => (
                  <div
                    key={stat.label}
                    className={`pt-6 pb-6 border-t border-foreground/10 transition-all duration-500 ${
                      i % 2 === 1 ? "pl-8 border-l border-l-foreground/10" : "pr-8"
                    } ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                    style={{ transitionDelay: `${300 + i * 80}ms` }}
                  >
                    <span className="block text-3xl font-serif font-medium text-primary mb-1 count-up-num">
                      {counts[i]}+
                    </span>
                    <span className="text-[10px] font-semibold tracking-[0.15em] uppercase text-foreground/40">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
