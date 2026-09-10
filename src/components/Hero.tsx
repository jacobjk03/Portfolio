"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown, Github, Linkedin, Mail, Globe, FileDown, Eye } from "lucide-react";
import { resumeData, RESUME_URL } from "@/config/resume-data";
import { useResumeDownload } from "@/hooks/useResumeDownload";
import { DownloadToast } from "@/components/DownloadToast";
import { ScrambleText } from "@/components/ScrambleText";
import { SkillMap } from "@/components/SkillMap";
import { SectionNumber } from "@/components/SectionNumber";

export default function Hero() {
  const [toastState, setToastState] = useState<{ message: string; position: { x: number; y: number } } | null>(null);
  const { downloadResume, isDownloading, showSuccessBadge } = useResumeDownload();

  const [tagline, setTagline] = useState("");
  const [taglineDone, setTaglineDone] = useState(false);
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);
  const taglineTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Kept shorter than personal.bio on purpose — this types out char-by-char
  // and has to stay within a few lines at the hero's width.
  const TAGLINE = "Data Scientist specializing in NLP, time series forecasting, and multi-agent AI systems, shipping production-grade AI on the cloud.";

  useEffect(() => {
    let i = 0;
    const typeNext = () => {
      if (i >= TAGLINE.length) { setTaglineDone(true); return; }
      i++;
      setTagline(TAGLINE.slice(0, i));
      taglineTimerRef.current = setTimeout(typeNext, 7);
    };
    taglineTimerRef.current = setTimeout(typeNext, 800);
    return () => { if (taglineTimerRef.current) clearTimeout(taglineTimerRef.current); };
  }, []);

  const socialIcons: Record<string, any> = {
    github: Github,
    linkedin: Linkedin,
    website: Globe,
  };

  // Kept so the name stays clickable for the scramble effect; the five-click
  // easter egg that enabled Recruiter Mode is gone along with the mode itself.
  const handleNameClick = () => {
    clickCountRef.current += 1;
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
    clickTimerRef.current = setTimeout(() => { clickCountRef.current = 0; }, 2000);
  };

  const graduationDate = resumeData.education.find(edu => edu.endDate?.includes("2026"))?.endDate || "May 2026";

  const handleResumeDownload = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    downloadResume({
      showToast: (message, position) => {
        setToastState({ message, position });
        setTimeout(() => setToastState(null), 500);
      },
      clickPosition: { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 },
    });
    const button = e.currentTarget as HTMLElement;
    button.classList.add("download-button-pulse");
    setTimeout(() => button.classList.remove("download-button-pulse"), 500);
  };

  return (
    <section
      id="home"
      className="min-h-screen flex flex-col justify-center pt-16 border-b border-foreground/8 relative overflow-hidden"
    >
      {/* Dot grid texture */}
      <div className="dot-grid-bg absolute inset-0 pointer-events-none" />


      <div className="max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-20 py-24 w-full relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7">
          {/* Top row: label + available indicator */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between mb-8 flex-wrap gap-4"
          >
            <span className="editorial-label">
              {resumeData.personal.title}
            </span>
            {/* Availability indicator */}
            <span className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.12em] uppercase text-foreground/50">
              <span className="w-2 h-2 rounded-full bg-green-500 avail-dot inline-block" />
              Open to Opportunities
            </span>
          </motion.div>

          {/* Name — scramble on hover */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
          >
            <h1
              onClick={handleNameClick}
              className="font-serif font-medium leading-[0.95] tracking-tight text-foreground cursor-pointer select-none mb-10"
              style={{ fontSize: "clamp(3.5rem, 9vw, 7rem)", userSelect: "none" }}
            >
              <ScrambleText text={resumeData.personal.name.split(" ")[0]} />
              <br />
              <ScrambleText text={resumeData.personal.name.split(" ").slice(1).join(" ") + "."} />
            </h1>
          </motion.div>

          {/* Quick facts — always shown. These used to be hidden behind a
              "Recruiter Mode" toggle, which meant the details recruiters most
              want were off by default and most visitors never found the switch.
              The "Recruiter Mode enabled" badge went with it: it described a
              mode that no longer exists. */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mb-8 flex flex-wrap gap-6 text-sm text-muted-foreground"
          >
            <span className="flex items-center gap-2">📍 {resumeData.personal.location}</span>
            <span className="flex items-center gap-2">US Work Eligible <span className="text-green-600">✓</span></span>
            <span className="flex items-center gap-2">🎓 {graduationDate} Graduate</span>
            <span className="flex items-center gap-2 text-primary font-medium">✈️ Open to relocate</span>
            <a href="#projects" className="text-primary hover:underline underline-offset-4">
              View Projects →
            </a>
          </motion.div>

          {/* Tagline — typewriter */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.7 }}
            className="font-serif italic text-xl md:text-2xl text-foreground/60 max-w-2xl mb-14 leading-relaxed min-h-[2em]"
          >
            {tagline}
            {!taglineDone && (
              <span className="inline-block w-[2px] h-[0.85em] bg-foreground/40 align-middle ml-0.5 animate-pulse" />
            )}
          </motion.p>

          {/* CTA Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="flex flex-wrap items-center gap-4 mb-14 relative"
          >
            <a
              href="#projects"
              className="btn-shimmer magnetic tilt px-8 py-3.5 bg-primary text-white text-[11px] font-semibold tracking-[0.15em] uppercase active:scale-95 transition-all"
              data-magnet="8" data-rotate="4" data-no-glow data-ripple="true" data-ripple-color="rgba(255,255,255,0.25)"
            >
              View My Work
            </a>
            <a
              href="#contact"
              className="btn-fill px-8 py-3.5 border border-foreground/20 text-foreground text-[11px] font-semibold tracking-[0.15em] uppercase active:scale-95 transition-all"
              data-ripple="true" data-ripple-color="rgba(184, 77, 39,0.3)"
            >
              Get In Touch
            </a>
            {/* Split Resume button: left = view, right = download */}
            <div className="flex border border-foreground/20 text-foreground text-[11px] font-semibold tracking-[0.15em] uppercase overflow-hidden">
              <a
                href={RESUME_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-fill flex items-center gap-2 px-6 py-3.5 hover:bg-foreground/5 active:scale-95 transition-all"
                data-ripple="true" data-ripple-color="rgba(184, 77, 39,0.3)"
              >
                <Eye className="w-3.5 h-3.5" />
                Resume
              </a>
              <div className="w-px bg-foreground/20 self-stretch" />
              {/* Instant tooltip instead of the native title, which waits ~2s */}
              <div className="relative group flex">
                <button
                  onClick={handleResumeDownload}
                  disabled={isDownloading}
                  className="btn-fill px-4 py-3.5 hover:bg-foreground/5 active:scale-95 transition-all flex items-center justify-center"
                  data-ripple="true" data-ripple-color="rgba(184, 77, 39,0.3)"
                  aria-label="Download resume"
                >
                  <FileDown className="w-3.5 h-3.5" />
                </button>
                <span className="nav-tip">Download</span>
              </div>
            </div>

            {showSuccessBadge && (
              <span className="absolute -bottom-7 left-0 text-xs text-primary font-medium download-success-badge">
                ✓ Resume delivered
              </span>
            )}
          </motion.div>

          {/* Social links */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="flex items-center gap-4"
          >
            {Object.entries(resumeData.socials).map(([key, value]) => {
              if (!value) return null;
              const Icon = socialIcons[key as keyof typeof socialIcons];
              if (!Icon) return null;
              return (
                <a
                  key={key}
                  href={value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 border border-foreground/15 flex items-center justify-center text-foreground/50 hover:border-primary hover:text-primary transition-all"
                  aria-label={key}
                >
                  <Icon className="w-4 h-4" />
                </a>
              );
            })}
            <a
              href="#contact"
              className="w-10 h-10 border border-foreground/15 flex items-center justify-center text-foreground/50 hover:border-primary hover:text-primary transition-all"
              aria-label="Go to the contact form"
            >
              <Mail className="w-4 h-4" />
            </a>
          </motion.div>
        </div>

        {/* Skill map — desktop only. Replaces the generic rotating cube with a
            graphic built from Jacob's own skill data. */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="lg:col-span-5 hidden lg:flex items-center justify-center"
        >
          <div className="relative w-full">
            <div className="absolute inset-0 -m-10 rounded-full bg-primary/[0.06] blur-3xl pointer-events-none" />
            <SkillMap />
          </div>
        </motion.div>

        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        >
          <ArrowDown className="w-4 h-4 text-foreground/30" />
        </motion.div>
      </motion.div>

      {toastState && (
        <DownloadToast message={toastState.message} position={toastState.position} />
      )}
    </section>
  );
}
