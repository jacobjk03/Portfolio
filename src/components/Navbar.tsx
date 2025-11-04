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

      // Update active section based on scroll position
      const sections = ["home", "about", "skills", "experience", "projects", "certifications", "contact"];
      
      // Get current scroll position (center of viewport)
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      
      let activeSection = "home";
      
      // Check each section and find which one the scroll position is in
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const element = document.getElementById(section);
        
        if (element) {
          const rect = element.getBoundingClientRect();
          const sectionTop = window.scrollY + rect.top;
          
          // If we've scrolled past the start of this section, it's the active one
          if (window.scrollY >= sectionTop - 200) {
            activeSection = section;
            break;
          }
        }
      }
      
      setActiveSection(activeSection);
    };
    
    // Call once on mount
    handleScroll();
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", href: "#home" },
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

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

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
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? "bg-white/70 dark:bg-background/80 backdrop-blur-md shadow-sm border-b border-black/10 dark:border-border dark:shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <motion.a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("#home");
            }}
            className="text-xl font-bold gradient-text"
            whileHover={{ scale: 1.05 }}
          >
            {resumeData.personal.name.split(" ")[0]}
          </motion.a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const sectionId = item.href.replace("#", "");
              const isActive = activeSection === sectionId;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }}
                  className={`px-4 py-2 rounded-lg transition-colors relative ${
                    isActive
                      ? "text-primary font-medium"
                      : "text-gray-700 dark:text-foreground/70 hover:text-gray-900 dark:hover:text-foreground"
                  }`}
                >
                  {item.name}
                  {isActive && (
                    <motion.div
                      layoutId="activeSection"
                      className="absolute inset-0 bg-primary/10 rounded-lg -z-10"
                      transition={{ type: "spring", duration: 0.5 }}
                    />
                  )}
                </a>
              );
            })}
            {mounted && (
              <>
                <button
                  onClick={handleResumeDownload}
                  disabled={isDownloading}
                  className="ml-2 p-2 rounded-lg border border-gray-200 dark:border-transparent hover:bg-gray-100 dark:hover:bg-secondary transition-colors text-gray-700 dark:text-foreground hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20 relative group"
                  aria-label="Download Resume PDF"
                  title="Download Resume (PDF)"
                >
                  <FileDown className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="ml-2 p-2 rounded-lg border border-gray-200 dark:border-transparent hover:bg-gray-100 dark:hover:bg-secondary transition-colors text-gray-700 dark:text-foreground"
                  aria-label="Toggle theme"
                >
                  {theme === "dark" ? (
                    <Sun className="w-5 h-5" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            {mounted && (
              <>
                <button
                  onClick={handleResumeDownload}
                  disabled={isDownloading}
                  className="p-2 rounded-lg border border-gray-200 dark:border-transparent hover:bg-gray-100 dark:hover:bg-secondary transition-colors text-gray-700 dark:text-foreground hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20 relative group"
                  aria-label="Download Resume PDF"
                  title="Download Resume (PDF)"
                >
                  <FileDown className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="p-2 rounded-lg border border-gray-200 dark:border-transparent hover:bg-gray-100 dark:hover:bg-secondary transition-colors text-gray-700 dark:text-foreground"
                  aria-label="Toggle theme"
                >
                  {theme === "dark" ? (
                    <Sun className="w-5 h-5" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                </button>
              </>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg border border-gray-200 dark:border-transparent hover:bg-gray-100 dark:hover:bg-secondary transition-colors text-gray-700 dark:text-foreground"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden bg-white/95 dark:bg-background/95 backdrop-blur-lg border-t border-gray-200 dark:border-border shadow-lg"
        >
          <div className="px-4 py-4 space-y-1">
            {navItems.map((item) => {
              const sectionId = item.href.replace("#", "");
              const isActive = activeSection === sectionId;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }}
                  className={`block py-3 px-4 rounded-lg transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-gray-700 dark:text-foreground/70 hover:bg-gray-100 dark:hover:bg-secondary hover:text-gray-900 dark:hover:text-foreground"
                  }`}
                >
                  {item.name}
                </a>
              );
            })}
            <button
              onClick={(e) => {
                setIsMobileMenuOpen(false);
                handleResumeDownload(e);
              }}
              disabled={isDownloading}
              className="w-full text-left py-3 px-4 rounded-lg transition-colors text-gray-700 dark:text-foreground/70 hover:bg-gray-100 dark:hover:bg-secondary hover:text-gray-900 dark:hover:text-foreground flex items-center gap-2"
            >
              <FileDown className="w-4 h-4" />
              Download Resume
            </button>
          </div>
        </motion.div>
      )}

      {/* Download Toast */}
      {toastState && (
        <DownloadToast
          message={toastState.message}
          position={toastState.position}
        />
      )}
    </motion.nav>
  );
}

