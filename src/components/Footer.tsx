"use client";

import { Github, Linkedin, Mail, Globe, ArrowUp, FileDown } from "lucide-react";
import { resumeData } from "@/config/resume-data";
import { useResumeDownload } from "@/hooks/useResumeDownload";
import { useRecruiterMode } from "@/hooks/useRecruiterMode";
import { RecruiterToast } from "@/components/RecruiterToast";

export default function Footer() {
  const { downloadResume, isDownloading } = useResumeDownload();
  const { isRecruiterMode, toggleRecruiterMode, showToast } = useRecruiterMode();

  const socialIcons: Record<string, any> = {
    github: Github,
    linkedin: Linkedin,
    website: Globe,
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const handleResumeDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    downloadResume({ delay: 300 });
  };

  return (
    <footer className="border-t border-foreground/8 py-16">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-20">

        {/* Main footer row */}
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h3 className="font-serif font-medium text-xl text-foreground mb-3">
              {resumeData.personal.name}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              {resumeData.personal.tagline}
            </p>
          </div>

          {/* Quick links */}
          <div>
            <span className="editorial-label block mb-5">Navigation</span>
            <ul className="space-y-2.5">
              {[
                { name: "About", href: "#about" },
                { name: "Projects", href: "#projects" },
                { name: "Experience", href: "#experience" },
                { name: "Certifications", href: "#certifications" },
                { name: "Contact", href: "#contact" },
              ].map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
              <li>
                <button
                  onClick={handleResumeDownload}
                  disabled={isDownloading}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
                >
                  Download Resume
                  <FileDown className="w-3.5 h-3.5" />
                </button>
              </li>
            </ul>
          </div>

          {/* Social + connect */}
          <div>
            <span className="editorial-label block mb-5">Connect</span>
            <div className="flex flex-wrap gap-2.5">
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
                href={`mailto:${resumeData.personal.email}`}
                className="w-10 h-10 border border-foreground/15 flex items-center justify-center text-foreground/50 hover:border-primary hover:text-primary transition-all"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-foreground/8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] font-medium tracking-[0.1em] uppercase text-foreground/35">
            © {new Date().getFullYear()} {resumeData.personal.name}
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => toggleRecruiterMode(true)}
              className="text-[11px] font-semibold tracking-[0.1em] uppercase text-foreground/40 hover:text-primary transition-colors border border-foreground/12 hover:border-primary/40 px-4 py-2"
            >
              Recruiter Mode: {isRecruiterMode ? "ON" : "OFF"}
            </button>
            <button
              onClick={scrollToTop}
              className="w-9 h-9 border border-foreground/15 flex items-center justify-center text-foreground/40 hover:border-primary hover:text-primary transition-all"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <RecruiterToast
        message=""
        isOn={isRecruiterMode}
        isVisible={showToast}
      />
    </footer>
  );
}
