"use client";

import React, { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Mail, Linkedin, Github, ArrowUpRight, PlaneTakeoff } from "lucide-react";
import { resumeData } from "@/config/resume-data";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { Scroll3DReveal } from "@/components/Scroll3DReveal";
import { SectionNumber } from "@/components/SectionNumber";
import { AnimatedDivider } from "@/components/AnimatedDivider";
import { ScrollTiltSection } from "@/components/ScrollTiltSection";

function HighlightWord({ children, delay = 0 }: {
  children: React.ReactNode;
  delay?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref as any, { once: true, margin: "-50px 0px" });
  return (
    <strong ref={ref} className="relative inline-block text-foreground font-medium">
      {children}
      <motion.span
        className="absolute left-0 w-full bg-primary pointer-events-none"
        style={{ bottom: "-1px", height: "1.5px", transformOrigin: "left" }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isInView ? 1 : 0 }}
        transition={{ duration: 0.65, delay, ease: [0.23, 1, 0.32, 1] }}
      />
    </strong>
  );
}

function FadeParagraph({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref as any, { once: true, margin: "-50px 0px" });
  return (
    <motion.p
      ref={ref}
      initial={{ opacity: 0, y: 14 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
    >
      {children}
    </motion.p>
  );
}

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

const BADGES = [
  { icon: "📍", label: resumeData.personal.location, variant: "plain" as const },
  { icon: "💼", label: "Available for work",          variant: "plain" as const },
  { icon: null,  label: "Open to relocate",           variant: "accent" as const },
];

function FlipBadges() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref as any, { once: true, margin: "-60px 0px" });

  return (
    <div
      ref={ref}
      className="flex flex-wrap items-center gap-3 mb-12"
      style={{ perspective: "600px" }}
    >
      {BADGES.map((badge, i) => (
        <motion.span
          key={badge.label}
          initial={{ opacity: 0, rotateX: 80, y: -4 }}
          animate={isInView ? { opacity: 1, rotateX: 0, y: 0 } : {}}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 18,
            delay: i * 0.13,
          }}
          style={{ transformOrigin: "top center", display: "inline-flex" }}
          className={
            badge.variant === "accent"
              ? "items-center gap-1.5 px-3 py-1.5 border border-primary/40 text-primary text-[11px] font-semibold tracking-[0.12em] uppercase bg-primary/5"
              : "items-center gap-2 text-sm text-muted-foreground px-3 py-1.5 border border-foreground/10 bg-secondary/30"
          }
        >
          {badge.icon && <span>{badge.icon}</span>}
          {badge.variant === "accent" && <PlaneTakeoff className="w-3 h-3" />}
          {badge.label}
        </motion.span>
      ))}
    </div>
  );
}

function FlipCard({ isVisible }: { isVisible: boolean }) {
  const [flipped, setFlipped] = useState(false);
  const linkedin = resumeData.socials?.linkedin;

  return (
    <div
      className={`lg:col-span-5 relative transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <div
        className="aspect-[3/4] relative cursor-pointer"
        style={{ perspective: "1200px" }}
        onMouseEnter={() => setFlipped(true)}
        onMouseLeave={() => setFlipped(false)}
      >
        <div
          className="w-full h-full relative"
          style={{
            transformStyle: "preserve-3d",
            transition: "transform 0.65s cubic-bezier(0.23, 1, 0.32, 1)",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* Front — photo */}
          <div className="absolute inset-0 overflow-hidden" style={{ backfaceVisibility: "hidden" }}>
            {resumeData.personal.avatar ? (
              <img
                src={resumeData.personal.avatar}
                alt={resumeData.personal.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-secondary flex items-center justify-center">
                <span className="text-8xl">👨‍💻</span>
              </div>
            )}
            <div className="absolute inset-0 border border-foreground/10 pointer-events-none" />
          </div>

          {/* Back — contact card */}
          <div
            className="absolute inset-0 flex flex-col overflow-hidden bg-background"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            {/* Violet top bar */}
            <div className="h-[3px] shrink-0 bg-primary" />

            {/* Big faded initials watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" aria-hidden>
              <span className="font-serif font-bold leading-none text-foreground/[0.04]" style={{ fontSize: "clamp(8rem, 22vw, 11rem)" }}>
                JK
              </span>
            </div>

            <div className="flex flex-col flex-1 px-7 py-6 relative z-10">

              {/* Name + title */}
              <div>
                <p className="text-[9px] font-semibold tracking-[0.2em] uppercase text-primary/70 mb-2">Available now</p>
                <h3 className="font-serif font-medium text-foreground leading-tight mb-1" style={{ fontSize: "1.35rem" }}>
                  {resumeData.personal.name}
                </h3>
                <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-primary">
                  {resumeData.personal.title}
                </p>
              </div>

              {/* Divider */}
              <div className="w-full h-px bg-foreground/8 my-5" />

              {/* Social links — large presentable blocks */}
              <div className="flex flex-col gap-3 flex-1">
                {linkedin && (
                  <a
                    href={linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between px-4 py-4 border border-foreground/10 bg-secondary/20 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 flex items-center justify-center border border-foreground/12 bg-background group-hover:border-primary/30 group-hover:text-primary transition-all">
                        <Linkedin className="w-4 h-4 text-foreground/50 group-hover:text-primary transition-colors" />
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-foreground/70 group-hover:text-foreground transition-colors">LinkedIn</p>
                        <p className="text-[10px] text-foreground/35 mt-0.5">Connect with me</p>
                      </div>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-foreground/25 group-hover:text-primary transition-colors" />
                  </a>
                )}

                {resumeData.socials?.github && (
                  <a
                    href={resumeData.socials.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between px-4 py-4 border border-foreground/10 bg-secondary/20 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 flex items-center justify-center border border-foreground/12 bg-background group-hover:border-primary/30 group-hover:text-primary transition-all">
                        <Github className="w-4 h-4 text-foreground/50 group-hover:text-primary transition-colors" />
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-foreground/70 group-hover:text-foreground transition-colors">GitHub</p>
                        <p className="text-[10px] text-foreground/35 mt-0.5">View my code</p>
                      </div>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-foreground/25 group-hover:text-primary transition-colors" />
                  </a>
                )}

                <a
                  href={`mailto:${resumeData.personal.email}`}
                  className="group flex items-center justify-between px-4 py-4 border border-foreground/10 bg-secondary/20 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 flex items-center justify-center border border-foreground/12 bg-background group-hover:border-primary/30 group-hover:text-primary transition-all">
                      <Mail className="w-4 h-4 text-foreground/50 group-hover:text-primary transition-colors" />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-foreground/70 group-hover:text-foreground transition-colors">Email</p>
                      <p className="text-[10px] text-foreground/35 mt-0.5">Get in touch</p>
                    </div>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-foreground/25 group-hover:text-primary transition-colors" />
                </a>
              </div>

              {/* Open to work */}
              <div className="flex items-center gap-2 pt-5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[9px] font-semibold tracking-[0.15em] uppercase text-foreground/35">
                  Immediate joiner · F-1 OPT
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Corner bracket decoration */}
      <div className="absolute -bottom-6 -right-6 w-32 h-32 border-r border-b border-foreground/10 pointer-events-none" />
    </div>
  );
}

export default function About() {
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.1, rootMargin: "-80px", triggerOnce: true });
  const { ref: statsRef, isVisible: statsVisible } = useIntersectionObserver({ threshold: 0.4, rootMargin: "-40px", triggerOnce: true });

  const rawStats = [
    { raw: resumeData.experience.length, label: "Roles & Internships" },
    { raw: resumeData.projects.length, label: "Projects Built" },
    { raw: resumeData.skills.reduce((acc, s) => acc + s.items.length, 0), label: "Technologies" },
    { raw: resumeData.certifications?.length || 0, label: "Certifications" },
  ];

  return (
    <section id="about" className="py-28 border-b border-foreground/8 relative overflow-hidden" ref={ref}>
      {/* Section number */}
      <SectionNumber number="01" />
      <ScrollTiltSection>
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-20">
        <div className="grid lg:grid-cols-12 gap-16 items-start">

          {/* Portrait — left column */}
          <FlipCard isVisible={isVisible} />

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
                <FadeParagraph>
                  I build AI that thinks, plans, and acts. Not just responds.
                  My focus is <HighlightWord>Agentic AI</HighlightWord> and{" "}
                  <HighlightWord>RAG systems</HighlightWord> powered by memory,
                  tool-use, and multi-step reasoning.
                </FadeParagraph>
                <FadeParagraph>
                  I ship production-ready LLM applications on{" "}
                  <HighlightWord>AWS</HighlightWord>, architected for speed,
                  reliability, and enterprise scale. Blending research and engineering, I design AI agents
                  you can trust, from real-time decision systems to voice-enabled assistants.
                </FadeParagraph>
                <FadeParagraph>
                  Recently graduated from{" "}
                  <HighlightWord>Arizona State University</HighlightWord> with
                  an MS in Data Science, focused on cloud-native AI systems and next-gen autonomous intelligence.
                </FadeParagraph>
              </div>

              {/* Location badges — flip-up reveal */}
              <FlipBadges />

              {/* Stats grid — odometer animation */}
              <div className="grid grid-cols-2 gap-0" ref={statsRef as React.RefObject<HTMLDivElement>}>
                {rawStats.map((stat, i) => (
                  <div
                    key={stat.label}
                    className={`pt-6 pb-6 border-t border-foreground/10 transition-all duration-500 ${
                      i % 2 === 1 ? "pl-8 border-l border-l-foreground/10" : "pr-8"
                    } ${statsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                    style={{ transitionDelay: `${200 + i * 60}ms` }}
                  >
                    <OdometerNumber value={stat.raw} isVisible={statsVisible} delay={300 + i * 120} />
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
      </ScrollTiltSection>
      <AnimatedDivider />
    </section>
  );
}
