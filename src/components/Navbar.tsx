"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Moon, Sun, Menu, X, FileDown } from "lucide-react";
import { useTheme } from "next-themes";
import { resumeData } from "@/config/resume-data";
import { useResumeDownload } from "@/hooks/useResumeDownload";
import { DownloadToast } from "@/components/DownloadToast";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [toastState, setToastState] = useState<{ message: string; position: { x: number; y: number } } | null>(null);
  const { downloadResume, isDownloading } = useResumeDownload();

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    const sections = ["home", "about", "skills", "experience", "projects", "certifications", "contact"];
    const observers: IntersectionObserver[] = [];
    let previousActive = "home";
    const intersectingSections = new Set<string>();

    sections.forEach((sectionId) => {
      const element = document.getElementById(sectionId);
      if (!element) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              intersectingSections.add(sectionId);
            } else {
              intersectingSections.delete(sectionId);
            }

            let newActive = previousActive;
            for (const id of sections) {
              if (intersectingSections.has(id)) {
                newActive = id;
                break;
              }
            }

            if (intersectingSections.size === 0) {
              const scrollY = window.scrollY;
              for (let i = sections.length - 1; i >= 0; i--) {
                const el = document.getElementById(sections[i]);
                if (el) {
                  const rect = el.getBoundingClientRect();
                  const sectionTop = window.scrollY + rect.top;
                  if (scrollY >= sectionTop - 200) {
                    newActive = sections[i];
                    break;
                  }
                }
              }
            }

            if (newActive !== previousActive) {
              setActiveSection(newActive);
              previousActive = newActive;
            }
          });
        },
        { rootMargin: "-20% 0px -60% 0px", threshold: 0.1 }
      );

      observer.observe(element);
      observers.push(observer);
    });

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  const navItems = [
    { name: "About", href: "#about" },
    { name: "Skills", href: "#skills" },
    { name: "Experience", href: "#experience" },
    { name: "Projects", href: "#projects" },
    { name: "Certifications", href: "#certifications" },
    { name: "Contact", href: "#contact" },
  ];

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  const handleResumeDownload = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    downloadResume({
      showToast: (message, position) => {
        setToastState({ message, position });
        setTimeout(() => setToastState(null), 500);
      },
      clickPosition: { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 },
    });
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md border-b border-foreground/8 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-20">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <a
            href="#home"
            onClick={(e) => { e.preventDefault(); handleNavClick("#home"); }}
            className="font-serif text-base font-medium tracking-tight text-foreground hover:text-primary transition-colors"
          >
            {resumeData.personal.name}
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => {
              const sectionId = item.href.replace("#", "");
              const isActive = activeSection === sectionId;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => { e.preventDefault(); handleNavClick(item.href); }}
                  className={`text-[11px] font-semibold tracking-[0.15em] uppercase transition-colors duration-200 relative pb-0.5 ${
                    isActive
                      ? "text-primary"
                      : "text-foreground/50 hover:text-foreground"
                  }`}
                >
                  {item.name}
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute bottom-0 left-0 right-0 h-px bg-primary"
                      transition={{ type: "spring", duration: 0.4 }}
                    />
                  )}
                </a>
              );
            })}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-3">
            {mounted && (
              <>
                <button
                  onClick={handleResumeDownload}
                  disabled={isDownloading}
                  className="p-2 text-foreground/50 hover:text-foreground transition-colors"
                  aria-label="Download Resume"
                  title="Download Resume PDF"
                >
                  <FileDown className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="p-2 text-foreground/50 hover:text-foreground transition-colors"
                  aria-label="Toggle theme"
                >
                  {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
              </>
            )}
            <a
              href="#contact"
              onClick={(e) => { e.preventDefault(); handleNavClick("#contact"); }}
              className="px-5 py-2 bg-primary text-white text-[11px] font-semibold tracking-[0.15em] uppercase hover:brightness-110 active:scale-95 transition-all"
            >
              Connect
            </a>
          </div>

          {/* Mobile actions */}
          <div className="md:hidden flex items-center gap-2">
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 text-foreground/60 hover:text-foreground transition-colors"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-foreground/60 hover:text-foreground transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden bg-background/98 backdrop-blur-lg border-t border-foreground/8"
        >
          <div className="px-6 py-6 space-y-1">
            {navItems.map((item) => {
              const sectionId = item.href.replace("#", "");
              const isActive = activeSection === sectionId;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => { e.preventDefault(); handleNavClick(item.href); }}
                  className={`block py-3 text-[11px] font-semibold tracking-[0.15em] uppercase transition-colors ${
                    isActive ? "text-primary" : "text-foreground/50 hover:text-foreground"
                  }`}
                >
                  {item.name}
                </a>
              );
            })}
            <button
              onClick={(e) => { setIsMobileMenuOpen(false); handleResumeDownload(e); }}
              disabled={isDownloading}
              className="flex items-center gap-2 py-3 text-[11px] font-semibold tracking-[0.15em] uppercase text-foreground/50 hover:text-foreground transition-colors"
            >
              <FileDown className="w-4 h-4" />
              Download Resume
            </button>
          </div>
        </motion.div>
      )}

      {toastState && (
        <DownloadToast message={toastState.message} position={toastState.position} />
      )}
    </motion.nav>
  );
}
