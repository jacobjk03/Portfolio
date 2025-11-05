"use client";

import { useState, useEffect } from "react";

interface GlassParallaxLayerProps {
  intensity?: number;
  tilt?: number;
  glow?: "purple" | "blue" | "cyan" | "pink";
  blur?: "sm" | "md" | "lg" | "xl" | "2xl";
}

const glowColors = {
  purple: "from-purple-500/15 via-violet-500/8 to-transparent",
  blue: "from-blue-500/15 via-sky-500/8 to-transparent",
  cyan: "from-cyan-500/15 via-teal-500/8 to-transparent",
  pink: "from-pink-500/15 via-rose-500/8 to-transparent",
};

/**
 * Optimized GlassParallaxLayer - Static gradients instead of backdrop-blur
 * Performance improvements:
 * - Removed backdrop-blur (GPU heavy) - replaced with CSS gradients
 * - Removed parallax depth hooks and scroll listeners
 * - Static positioning - no continuous animations
 * - Reduced opacity for better performance
 */
export function GlassParallaxLayer({
  intensity = 1,
  tilt = 2,
  glow = "purple",
  blur = "xl", // Still accepted but not used for blur
}: GlassParallaxLayerProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  if (prefersReducedMotion) {
    return null;
  }

  return (
    <>
      {/* Glow layer - static gradient, no backdrop-blur */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 dark:opacity-40 transition-opacity duration-500"
        style={{
          willChange: "opacity",
        }}
      >
        <div
          className={`absolute inset-0 bg-gradient-to-br ${glowColors[glow]}`}
          style={{
            // Subtle gradient overlay instead of blur
            background: `radial-gradient(ellipse at 50% 0%, ${glow === "purple" ? "rgba(139, 92, 246, 0.15)" : glow === "blue" ? "rgba(59, 130, 246, 0.15)" : glow === "cyan" ? "rgba(6, 182, 212, 0.15)" : "rgba(236, 72, 153, 0.15)"} 0%, transparent 60%)`,
          }}
        />
      </div>

      {/* Glass layer - static gradient border, no backdrop-blur */}
      <div
        className="absolute inset-4 md:inset-8 lg:inset-12 pointer-events-none rounded-2xl bg-white/3 dark:bg-white/3 border border-white/10 shadow-[0_4px_15px_rgb(0,0,0,0.08)] opacity-0 dark:opacity-80 transition-opacity duration-500"
        style={{
          // Static gradient background instead of backdrop-blur
          background: "radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.01))",
          willChange: "opacity",
        }}
      >
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/3 via-transparent to-black/3" />
        <div
          className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
        />
      </div>
    </>
  );
}
