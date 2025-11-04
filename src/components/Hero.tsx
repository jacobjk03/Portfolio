"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown, Github, Linkedin, Mail, Twitter, Globe, FileDown } from "lucide-react";
import { resumeData } from "@/config/resume-data";
import { useResumeDownload } from "@/hooks/useResumeDownload";
import { DownloadToast } from "@/components/DownloadToast";
import { useRecruiterMode } from "@/hooks/useRecruiterMode";
import { RecruiterToast } from "@/components/RecruiterToast";

export default function Hero() {
  const [toastState, setToastState] = useState<{ message: string; position: { x: number; y: number } } | null>(null);
  const { downloadResume, isDownloading, showSuccessBadge } = useResumeDownload();
  const { isRecruiterMode, toggleRecruiterMode, showToast } = useRecruiterMode();
  
  // Easter egg: click name 5 times fast
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);
  const nameRef = useRef<HTMLSpanElement>(null);

  const socialIcons: Record<string, any> = {
    github: Github,
    linkedin: Linkedin,
    twitter: Twitter,
    website: Globe,
  };

  const handleNameClick = () => {
    clickCountRef.current += 1;
    
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
    }

    if (clickCountRef.current >= 5) {
      if (!isRecruiterMode) {
        toggleRecruiterMode(true);
      }
      clickCountRef.current = 0;
    }

    clickTimerRef.current = setTimeout(() => {
      clickCountRef.current = 0;
    }, 2000); // Reset after 2 seconds
  };

  // Get graduation date from education
  const graduationDate = resumeData.education.find(edu => edu.endDate === "2026")?.endDate || "2026";
  const graduationMonth = "May"; // You can extract this from education data if needed

  const handleResumeDownload = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const clickPosition = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };

    downloadResume({
      showToast: (message, position) => {
        setToastState({ message, position });
        setTimeout(() => setToastState(null), 500);
      },
      clickPosition,
      onSuccess: () => {
        // Button pulse handled by CSS class
      },
    });

    // Add pulse animation class
    const button = e.currentTarget as HTMLElement;
    button.classList.add("download-button-pulse");
    setTimeout(() => {
      button.classList.remove("download-button-pulse");
    }, 500);
  };

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              {resumeData.personal.tagline}
            </span>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6">
              <span 
                ref={nameRef}
                onClick={handleNameClick}
                className="gradient-text cursor-pointer select-none"
                style={{ userSelect: "none" }}
              >
                {resumeData.personal.name}
              </span>
            </h1>
            
            {/* Recruiter Mode Badge */}
            <AnimatePresence>
              {isRecruiterMode && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="mb-4"
                >
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 recruiter-badge">
                    <span className="text-lg">🎯</span>
                    <span className="text-sm font-medium text-primary">
                      Recruiter Mode Active — Quick Access Enabled
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Resume Download CTA (Recruiter Mode) */}
            <AnimatePresence>
              {isRecruiterMode && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="mb-6"
                >
                  <button
                    onClick={handleResumeDownload}
                    disabled={isDownloading}
                    className="px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-all shadow-lg hover:shadow-xl hover:shadow-primary/20 flex items-center gap-2 mx-auto"
                    aria-label="Download Resume PDF"
                  >
                    <FileDown className="w-4 h-4" />
                    Download Resume PDF
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Quick Facts Bar (Recruiter Mode) */}
            <AnimatePresence>
              {isRecruiterMode && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ 
                    duration: 0.4, 
                    delay: 0.2,
                    ease: "easeOut"
                  }}
                  className="mb-8"
                >
                  <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-2">
                      <span>📍</span>
                      <span>{resumeData.personal.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>US Work Eligibility</span>
                      <span className="text-green-500">✅</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>{graduationMonth} {graduationDate} Graduation</span>
                      <span>🎓</span>
                    </div>
                  </div>
                  {/* Projects Summary PDF Link (Placeholder) */}
                  <div className="text-center">
                    <a
                      href="#projects"
                      className="text-sm text-primary hover:text-primary/80 transition-colors underline underline-offset-2"
                    >
                      View Projects Summary PDF →
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl sm:text-2xl md:text-3xl text-muted-foreground mb-8 font-medium"
          >
            {resumeData.personal.title}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            {resumeData.personal.bio}
          </motion.p>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center justify-center flex-wrap gap-4 mb-12"
          >
            {Object.entries(resumeData.socials).map(([key, value]) => {
              if (!value) return null;
              const Icon = socialIcons[key as keyof typeof socialIcons];
              if (!Icon) return null;
              return (
                <motion.a
                  key={key}
                  href={value}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors shadow-lg"
                  aria-label={key}
                >
                  <Icon className="w-6 h-6" />
                </motion.a>
              );
            })}
            <motion.a
              href={`mailto:${resumeData.personal.email}`}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors shadow-lg"
              aria-label="Email"
            >
              <Mail className="w-6 h-6" />
            </motion.a>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 relative"
          >
            <a
              href="#projects"
              className="px-8 py-4 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-all shadow-lg hover:shadow-xl hover:shadow-primary/20"
            >
              View My Work
            </a>
            <a
              href="#contact"
              className="px-8 py-4 border-2 border-primary text-primary rounded-full font-medium hover:bg-primary hover:text-primary-foreground transition-all shadow-lg"
            >
              Get In Touch
            </a>
            <button
              onClick={handleResumeDownload}
              disabled={isDownloading}
              className="px-8 py-4 border-2 border-primary/70 text-primary rounded-full font-medium hover:bg-primary hover:text-primary-foreground transition-all shadow-lg hover:shadow-xl hover:shadow-primary/20 flex items-center gap-2"
              aria-label="Download Resume PDF"
            >
              <FileDown className="w-4 h-4" />
              Download Resume
            </button>
            {showSuccessBadge && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 download-success-badge"
              >
                <span className="text-sm text-primary font-medium flex items-center gap-1">
                  <span>✅</span> Secure PDF delivered
                </span>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-sm text-muted-foreground">Scroll Down</span>
            <ArrowDown className="w-6 h-6 text-muted-foreground" />
          </motion.div>
        </motion.div>
      </div>

      {/* Download Toast */}
      {toastState && (
        <DownloadToast
          message={toastState.message}
          position={toastState.position}
        />
      )}

      {/* Recruiter Mode Toast */}
      <RecruiterToast
        message={isRecruiterMode ? "Recruiter mode activated ✅ Optimized for hiring review." : "Recruiter mode deactivated"}
        isVisible={showToast}
      />
    </section>
  );
}

