"use client";

import { resumeData } from "@/config/resume-data";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { Scroll3DReveal } from "@/components/Scroll3DReveal";
import { SectionNumber } from "@/components/SectionNumber";
import { AnimatedDivider } from "@/components/AnimatedDivider";

const DIGIT_H = 56;
const ROLL_CYCLES = 3;

function OdometerDigit({ digit, delay, isVisible }: {
  digit: number;
  delay: number;
  isVisible: boolean;
}) {
  const totalItems = ROLL_CYCLES * 10 + digit + 1;
  const finalY = (ROLL_CYCLES * 10 + digit) * DIGIT_H;

  return (
    <span style={{ display: "inline-block", height: DIGIT_H, overflow: "hidden", verticalAlign: "top" }}>
      <span
        style={{
          display: "block",
          transform: isVisible ? `translateY(-${finalY}px)` : "translateY(0px)",
          transition: isVisible
            ? `transform 1.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`
            : "none",
          willChange: "transform",
        }}
      >
        {Array.from({ length: totalItems }, (_, i) => (
          <span key={i} style={{ display: "block", height: DIGIT_H, lineHeight: `${DIGIT_H}px` }}>
            {i % 10}
          </span>
        ))}
      </span>
    </span>
  );
}

function OdometerNumber({ value, isVisible, delay }: {
  value: number;
  isVisible: boolean;
  delay: number;
}) {
  const digits = String(value).split("").map(Number);
  return (
    <span
      className="font-serif font-medium text-primary count-up-num"
      style={{ fontSize: "2.25rem", display: "inline-flex", alignItems: "flex-start", height: DIGIT_H }}
    >
      {digits.map((digit, i) => (
        <OdometerDigit key={i} digit={digit} isVisible={isVisible} delay={delay + i * 100} />
      ))}
      <span style={{ lineHeight: `${DIGIT_H}px`, paddingLeft: 2 }}>+</span>
    </span>
  );
}

export default function About() {
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.1, rootMargin: "-80px", triggerOnce: true });

  const rawStats = [
    { raw: resumeData.experience.length, label: "Roles & Internships" },
    { raw: resumeData.projects.length, label: "Projects Built" },
    { raw: resumeData.skills.reduce((acc, s) => acc + s.items.length, 0), label: "Technologies" },
    { raw: resumeData.certifications?.length || 0, label: "Certifications" },
  ];

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

              {/* Stats grid — odometer animation */}
              <div className="grid grid-cols-2 gap-0">
                {rawStats.map((stat, i) => (
                  <div
                    key={stat.label}
                    className={`pt-6 pb-6 border-t border-foreground/10 transition-all duration-500 ${
                      i % 2 === 1 ? "pl-8 border-l border-l-foreground/10" : "pr-8"
                    } ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                    style={{ transitionDelay: `${200 + i * 60}ms` }}
                  >
                    <OdometerNumber value={stat.raw} isVisible={isVisible} delay={300 + i * 120} />
                    <span className="block text-[10px] font-semibold tracking-[0.15em] uppercase text-foreground/40 mt-1">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
      <AnimatedDivider />
    </section>
  );
}
