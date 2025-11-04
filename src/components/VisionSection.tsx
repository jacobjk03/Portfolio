"use client";

import { ReactNode } from "react";
import { useVisionScroll } from "@/hooks/useVisionScroll";
import { VolumetricLight } from "./VolumetricLight";
import { BokehField } from "./BokehField";
import { GlassParallaxLayer } from "./GlassParallaxLayer";

interface VisionSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  enableLightBeams?: boolean;
  lightPosition?: "left" | "right" | "center";
  lightColor?: "purple" | "blue" | "cyan";
  lightIntensity?: number;
  bokehDensity?: number;
  bokehColors?: string[];
  bokehLayers?: number;
  bokehSeed?: number;
  enableGlassDepth?: boolean;
  glassIntensity?: number;
  glassTilt?: number;
  glassGlow?: "purple" | "blue" | "cyan" | "pink";
  glassBlur?: "sm" | "md" | "lg" | "xl" | "2xl";
}

/**
 * Vision Pro-style section wrapper with spatial depth animations
 * Each section lifts into view with blur-to-focus, scale, and glow
 * Optionally adds VisionOS-style volumetric light beams and bokeh particles
 */
export function VisionSection({
  children,
  className = "",
  delay = 0,
  enableLightBeams = false,
  lightPosition = "left",
  lightColor = "purple",
  lightIntensity = 0.6,
  bokehDensity = 0.8,
  bokehColors = ["#8b5cf6", "#22d3ee", "#a855f7"],
  bokehLayers = 3,
  bokehSeed,
  enableGlassDepth = false,
  glassIntensity = 1,
  glassTilt = 2,
  glassGlow = "purple",
  glassBlur = "xl",
}: VisionSectionProps) {
  const { ref, isVisible } = useVisionScroll({
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
    triggerOnce: true,
  });

  return (
    <section
      ref={ref}
      className={`vision-section ${isVisible ? "vision-visible" : ""} ${className} relative overflow-hidden`}
      style={{
        animationDelay: `${delay}ms`,
      }}
    >
      {enableGlassDepth && (
        <GlassParallaxLayer
          intensity={glassIntensity}
          tilt={glassTilt}
          glow={glassGlow}
          blur={glassBlur}
        />
      )}
      <BokehField
        density={bokehDensity}
        colors={bokehColors}
        layers={bokehLayers}
        seed={bokehSeed}
      />
      {enableLightBeams && (
        <VolumetricLight
          position={lightPosition}
          color={lightColor}
          intensity={lightIntensity}
          delay={delay}
        />
      )}
      <div className="relative z-10">
        {children}
      </div>
    </section>
  );
}

