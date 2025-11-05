"use client";

import { useEffect, useState } from "react";

/**
 * AIBackdrop - Optimized Static Gradient Background
 * 
 * Performance Optimizations:
 * - Replaced Framer Motion scroll triggers with static gradients
 * - Removed heavy blur filters (30-35px) - replaced with CSS gradients
 * - Removed parallax mouse tracking
 * - Removed scroll-based hue rotation
 * - Static orbs using CSS gradients instead of animated divs
 * - Minimal GPU usage
 * - Respects prefers-reduced-motion
 */

export default function AIBackdrop() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Base dark background */}
      <div className="absolute inset-0 bg-[#0a0a0a]" />

      {/* Static gradient orbs using CSS only - no blur filters */}
      <div className="absolute inset-0">
        {/* Purple orb - Top left */}
        <div
          className="absolute -top-[20%] -left-[10%] w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] min-w-[300px] min-h-[300px]"
          style={{
            background: "radial-gradient(circle, rgba(123, 97, 255, 0.4) 0%, rgba(123, 97, 255, 0.15) 40%, transparent 70%)",
            mixBlendMode: "screen",
            opacity: prefersReducedMotion ? 0.5 : 0.5,
          }}
        />

        {/* Cyan/Blue orb - Top right */}
        <div
          className="absolute -top-[10%] -right-[15%] w-[45vw] h-[45vw] max-w-[700px] max-h-[700px] min-w-[350px] min-h-[350px]"
          style={{
            background: "radial-gradient(circle, rgba(59, 130, 246, 0.35) 0%, rgba(0, 255, 231, 0.2) 30%, transparent 60%)",
            mixBlendMode: "screen",
            opacity: prefersReducedMotion ? 0.4 : 0.45,
          }}
        />

        {/* Magenta/Pink orb - Center */}
        <div
          className="absolute top-[30%] left-[20%] w-[35vw] h-[35vw] max-w-[500px] max-h-[500px] min-w-[280px] min-h-[280px]"
          style={{
            background: "radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, rgba(168, 85, 247, 0.2) 35%, transparent 65%)",
            mixBlendMode: "screen",
            opacity: prefersReducedMotion ? 0.3 : 0.4,
          }}
        />

        {/* Purple accent orb - Bottom right */}
        <div
          className="absolute bottom-[10%] right-[10%] w-[38vw] h-[38vw] max-w-[550px] max-h-[550px] min-w-[300px] min-h-[300px]"
          style={{
            background: "radial-gradient(circle, rgba(139, 92, 246, 0.35) 0%, rgba(123, 97, 255, 0.15) 40%, transparent 70%)",
            mixBlendMode: "screen",
            opacity: prefersReducedMotion ? 0.35 : 0.45,
          }}
        />

        {/* Subtle blue accent - Bottom left */}
        <div
          className="absolute bottom-[20%] left-[5%] w-[30vw] h-[30vw] max-w-[450px] max-h-[450px] min-w-[250px] min-h-[250px]"
          style={{
            background: "radial-gradient(circle, rgba(96, 165, 250, 0.3) 0%, rgba(59, 130, 246, 0.15) 45%, transparent 70%)",
            mixBlendMode: "screen",
            opacity: prefersReducedMotion ? 0.3 : 0.4,
          }}
        />
      </div>

      {/* Subtle noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='4' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          mixBlendMode: "overlay",
        }}
      />

      {/* Lighter vignette for softer edges */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.2) 100%)",
          mixBlendMode: "multiply",
        }}
      />
    </div>
  );
}
