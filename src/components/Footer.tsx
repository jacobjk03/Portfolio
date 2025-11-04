"use client";

import { Github, Linkedin, Mail, Twitter, Heart, ArrowUp, Globe, FileDown } from "lucide-react";
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
    twitter: Twitter,
    website: Globe,
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleResumeDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    downloadResume({
      delay: 300,
    });
  };

  const handleRecruiterToggle = () => {
    toggleRecruiterMode(true);
  };

  return (
    <footer className="py-12 border-t border-border bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold gradient-text mb-4">
              {resumeData.personal.name}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {resumeData.personal.tagline}
            </p>
            <p className="text-xs text-muted-foreground">
              Building the future, one line of code at a time.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { name: "Home", href: "#home" },
                { name: "About", href: "#about" },
                { name: "Projects", href: "#projects" },
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
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 cursor-pointer"
                  aria-label="Download Resume PDF"
                >
                  Download Resume <FileDown className="w-3 h-3 inline" />
                </button>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <div className="flex flex-wrap gap-3">
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
                    className="p-3 rounded-lg bg-secondary hover:bg-primary hover:text-primary-foreground transition-all shadow-sm hover:shadow-md hover:-translate-y-1"
                    aria-label={key}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
              <a
                href={`mailto:${resumeData.personal.email}`}
                className="p-3 rounded-lg bg-secondary hover:bg-primary hover:text-primary-foreground transition-all shadow-sm hover:shadow-md hover:-translate-y-1"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground text-center flex items-center gap-2">
            Made with <Heart className="w-4 h-4 text-red-500 fill-current animate-pulse" /> by{" "}
            {resumeData.personal.name}
          </p>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={handleRecruiterToggle}
              className="px-4 py-2 rounded-lg border border-primary/30 hover:border-primary/50 bg-primary/5 hover:bg-primary/10 transition-all text-sm font-medium text-primary"
              aria-label="Toggle Recruiter Mode"
            >
              Recruiter Mode: {isRecruiterMode ? "ON" : "OFF"}
            </button>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-lg hover:shadow-xl"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Recruiter Mode Toast */}
      <RecruiterToast
        message={isRecruiterMode ? "Recruiter mode activated ✅ Optimized for hiring review." : "Recruiter mode deactivated"}
        isVisible={showToast}
      />
    </footer>
  );
}

