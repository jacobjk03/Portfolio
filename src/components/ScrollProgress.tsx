"use client";

import { useEffect, useState } from "react";

/**
 * Optimized Scroll Progress Indicator
 * - Thin bar at top with neon gradient (#8A2BE2 → #00CFFF)
 * - Subtle glow effect
 * - Smooth updates without performance degradation
 * - Respects prefers-reduced-motion
 */
export default function ScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);

    // Throttled scroll handler for performance
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
          const scrolled = window.scrollY;
          const progress = scrollHeight > 0 ? scrolled / scrollHeight : 0;
          setScrollProgress(Math.min(1, Math.max(0, progress)));
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => {
      window.removeEventListener("scroll", handleScroll);
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  // Don't show animation if reduced motion is preferred
  if (prefersReducedMotion) {
    return (
      <div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#8A2BE2] via-[#8B5CF6] to-[#00CFFF] origin-left z-50"
        style={{ transform: `scaleX(${scrollProgress})` }}
      />
    );
  }

  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-50 overflow-hidden">
      {/* Background track */}
      <div className="absolute inset-0 bg-gray-200/20 dark:bg-gray-800/20" />
      
      {/* Progress bar with neon gradient and glow */}
      <div
        className="absolute inset-y-0 left-0 origin-left transition-transform duration-150 ease-out"
        style={{
          transform: `scaleX(${scrollProgress})`,
          width: "100%",
          background: "linear-gradient(90deg, #8A2BE2 0%, #8B5CF6 50%, #00CFFF 100%)",
          boxShadow: scrollProgress > 0 ? "0 0 10px rgba(138, 43, 226, 0.5), 0 0 20px rgba(0, 207, 255, 0.3)" : "none",
          willChange: "transform",
        }}
      />
    </div>
  );
}
