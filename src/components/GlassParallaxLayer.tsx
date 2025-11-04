"use client";

import { useParallaxDepth } from "@/hooks/useParallaxDepth";

interface GlassParallaxLayerProps {
  intensity?: number;
  tilt?: number;
  glow?: "purple" | "blue" | "cyan" | "pink";
  blur?: "sm" | "md" | "lg" | "xl" | "2xl";
}

const glowColors = {
  purple: "from-purple-500/20 via-violet-500/10 to-transparent",
  blue: "from-blue-500/20 via-sky-500/10 to-transparent",
  cyan: "from-cyan-500/20 via-teal-500/10 to-transparent",
  pink: "from-pink-500/20 via-rose-500/10 to-transparent",
};

const blurClasses = {
  sm: "backdrop-blur-sm",
  md: "backdrop-blur-md",
  lg: "backdrop-blur-lg",
  xl: "backdrop-blur-xl",
  "2xl": "backdrop-blur-2xl",
};

export function GlassParallaxLayer({
  intensity = 1,
  tilt = 2,
  glow = "purple",
  blur = "xl",
}: GlassParallaxLayerProps) {
  const { scrollY, tiltX, tiltY } = useParallaxDepth({ intensity, tilt, enableTilt: true });

  const glowOffset = scrollY * 0.05;
  const glassOffset = scrollY * 0.02;

  return (
    <>
      <div
        className="absolute inset-0 pointer-events-none opacity-0 dark:opacity-60 transition-opacity duration-500"
        style={{
          transform: `translate3d(0, ${glowOffset}px, 0) scale(1.01)`,
          willChange: "transform",
        }}
      >
        <div
          className={`absolute inset-0 bg-gradient-to-br ${glowColors[glow]} blur-3xl`}
          style={{
            transform: `rotate3d(1, 0, 0, ${tiltX * 0.3}deg) rotate3d(0, 1, 0, ${tiltY * 0.3}deg)`,
          }}
        />
      </div>

      <div
        className={`absolute inset-4 md:inset-8 lg:inset-12 pointer-events-none rounded-2xl bg-white/5 dark:bg-white/5 ${blurClasses[blur]} border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] opacity-0 dark:opacity-100 transition-opacity duration-500`}
        style={{
          transform: `translate3d(0, ${glassOffset}px, 0) rotate3d(1, 0, 0, ${tiltX}deg) rotate3d(0, 1, 0, ${tiltY}deg) scale(1.005)`,
          willChange: "transform",
          background: "radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02))",
        }}
      >
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 via-transparent to-black/5" />
        <div
          className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
          style={{
            transform: `translateY(${Math.abs(tiltX) * 2}px)`,
          }}
        />
      </div>
    </>
  );
}

