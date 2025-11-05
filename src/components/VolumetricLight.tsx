"use client";

import { useEffect, useRef, useState } from "react";

interface VolumetricLightProps {
  intensity?: number;
  color?: "purple" | "blue" | "cyan";
  position?: "left" | "right" | "center";
  delay?: number;
  enabled?: boolean; // New prop: only show when enabled
}

/**
 * Optimized VolumetricLight - Event-based, reduced blur
 * Performance improvements:
 * - Only renders when enabled prop is true
 * - Removed continuous scroll/mouse listeners
 * - Reduced blur from 80px to 40px
 * - Static position instead of parallax
 * - Respects prefers-reduced-motion
 */
export function VolumetricLight({
  intensity = 0.6,
  color = "purple",
  position = "left",
  delay = 0,
  enabled = false, // Default to false - only show when explicitly enabled
}: VolumetricLightProps) {
  const lightRef = useRef<HTMLDivElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const colorMap = {
    purple: {
      primary: "rgba(139, 92, 246, 0.3)", // Reduced opacity
      secondary: "rgba(168, 85, 247, 0.2)",
      glow: "rgba(139, 92, 246, 0.4)",
    },
    blue: {
      primary: "rgba(59, 130, 246, 0.3)",
      secondary: "rgba(96, 165, 250, 0.2)",
      glow: "rgba(59, 130, 246, 0.4)",
    },
    cyan: {
      primary: "rgba(6, 182, 212, 0.3)",
      secondary: "rgba(34, 211, 238, 0.2)",
      glow: "rgba(6, 182, 212, 0.4)",
    },
  };

  const colors = colorMap[color];

  const positionMap = {
    left: "-20%",
    center: "50%",
    right: "80%",
  };

  // Don't render if disabled or reduced motion
  if (!enabled || prefersReducedMotion) {
    return null;
  }

  return (
    <div
      ref={lightRef}
      className="pointer-events-none absolute inset-0 overflow-hidden opacity-0 dark:opacity-100 transition-opacity duration-500"
      style={{
        animationDelay: `${delay}ms`,
      }}
    >
      {/* Main volumetric light beam - reduced blur */}
      <div
        className="absolute top-0 w-[600px] h-[600px] transition-opacity duration-1000 ease-out"
        style={{
          left: positionMap[position],
          transform: "translate(-50%, -20%) rotate(-45deg)",
          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 40%, transparent 70%)`,
          filter: `blur(40px)`, // Reduced from 80px
          opacity: intensity,
          mixBlendMode: "screen",
          willChange: "opacity",
        }}
      />

      {/* Secondary streak - reduced blur */}
      <div
        className="absolute top-[20%] w-[400px] h-[400px] transition-opacity duration-700 ease-out"
        style={{
          left: position === "left" ? "10%" : position === "right" ? "60%" : "40%",
          transform: "translate(-50%, 0) rotate(-30deg)",
          background: `radial-gradient(ellipse at center, ${colors.secondary} 0%, transparent 60%)`,
          filter: `blur(30px)`, // Reduced from 60px
          opacity: intensity * 0.6,
          mixBlendMode: "screen",
          willChange: "opacity",
        }}
      />

      {/* Edge glow - static gradient instead of animated */}
      <div
        className="absolute inset-0 transition-opacity duration-1000 ease-out"
        style={{
          background: `linear-gradient(${position === "left" ? "to right" : position === "right" ? "to left" : "to bottom"}, ${colors.primary} 0%, transparent 30%)`,
          filter: `blur(25px)`, // Reduced from 50px
          opacity: intensity * 0.25,
          mixBlendMode: "screen",
          willChange: "opacity",
        }}
      />
    </div>
  );
}

// Preset configurations
export function VolumetricLightLeft(props: Partial<VolumetricLightProps>) {
  return <VolumetricLight position="left" color="purple" {...props} />;
}

export function VolumetricLightRight(props: Partial<VolumetricLightProps>) {
  return <VolumetricLight position="right" color="blue" {...props} />;
}

export function VolumetricLightCenter(props: Partial<VolumetricLightProps>) {
  return <VolumetricLight position="center" color="cyan" {...props} />;
}
