"use client";

import { useEffect, useRef, useState } from "react";

interface VolumetricLightProps {
  intensity?: number;
  color?: "purple" | "blue" | "cyan";
  position?: "left" | "right" | "center";
  delay?: number;
}

export function VolumetricLight({
  intensity = 0.6,
  color = "purple",
  position = "left",
  delay = 0,
}: VolumetricLightProps) {
  const lightRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!lightRef.current) return;
      const rect = lightRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setMousePos({ x, y });
    };

    const handleScroll = () => {
      if (!lightRef.current) return;
      const rect = lightRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const elementTop = rect.top;
      const progress = Math.max(0, Math.min(1, 1 - elementTop / viewportHeight));
      setScrollProgress(progress);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial call

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const colorMap = {
    purple: {
      primary: "rgba(139, 92, 246, 0.4)",
      secondary: "rgba(168, 85, 247, 0.3)",
      glow: "rgba(139, 92, 246, 0.6)",
    },
    blue: {
      primary: "rgba(59, 130, 246, 0.4)",
      secondary: "rgba(96, 165, 250, 0.3)",
      glow: "rgba(59, 130, 246, 0.6)",
    },
    cyan: {
      primary: "rgba(6, 182, 212, 0.4)",
      secondary: "rgba(34, 211, 238, 0.3)",
      glow: "rgba(6, 182, 212, 0.6)",
    },
  };

  const colors = colorMap[color];

  const positionMap = {
    left: "-20%",
    center: "50%",
    right: "80%",
  };

  const parallaxX = (mousePos.x - 0.5) * 30;
  const parallaxY = (mousePos.y - 0.5) * 30;

  return (
    <div
      ref={lightRef}
      className="pointer-events-none absolute inset-0 overflow-hidden opacity-0 dark:opacity-100 transition-opacity duration-500"
      style={{
        animationDelay: `${delay}ms`,
      }}
    >
      {/* Main volumetric light beam */}
      <div
        className="absolute top-0 w-[800px] h-[800px] transition-all duration-1000 ease-out"
        style={{
          left: positionMap[position],
          transform: `translate(-50%, -20%) translate(${parallaxX * 0.5}px, ${parallaxY * 0.5}px) rotate(-45deg) scale(${0.8 + scrollProgress * 0.4})`,
          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 40%, transparent 70%)`,
          filter: `blur(80px)`,
          opacity: intensity * scrollProgress,
          mixBlendMode: "screen",
        }}
      />

      {/* Secondary streak */}
      <div
        className="absolute top-[20%] w-[600px] h-[600px] transition-all duration-700 ease-out"
        style={{
          left: position === "left" ? "10%" : position === "right" ? "60%" : "40%",
          transform: `translate(-50%, 0) translate(${parallaxX * 0.3}px, ${parallaxY * 0.3}px) rotate(-30deg) scale(${0.9 + scrollProgress * 0.2})`,
          background: `radial-gradient(ellipse at center, ${colors.secondary} 0%, transparent 60%)`,
          filter: `blur(60px)`,
          opacity: intensity * 0.7 * scrollProgress,
          mixBlendMode: "screen",
        }}
      />

      {/* Glass refraction sparkle */}
      <div
        className="absolute top-[40%] w-[400px] h-[400px] animate-pulse transition-all duration-500"
        style={{
          left: position === "left" ? "15%" : position === "right" ? "70%" : "50%",
          transform: `translate(-50%, -50%) translate(${parallaxX}px, ${parallaxY}px)`,
          background: `radial-gradient(circle at center, ${colors.glow} 0%, transparent 50%)`,
          filter: `blur(40px)`,
          opacity: intensity * 0.4 * scrollProgress,
          mixBlendMode: "screen",
          animationDuration: "3s",
        }}
      />

      {/* Edge glow sweep */}
      <div
        className="absolute inset-0 transition-all duration-1000 ease-out"
        style={{
          background: `linear-gradient(${position === "left" ? "to right" : position === "right" ? "to left" : "to bottom"}, ${colors.primary} 0%, transparent 30%)`,
          filter: `blur(50px)`,
          opacity: intensity * 0.3 * scrollProgress,
          mixBlendMode: "screen",
        }}
      />

      {/* Foggy light cone */}
      <div
        className="absolute w-[500px] h-[500px] animate-breathe transition-all duration-1000"
        style={{
          top: "50%",
          left: positionMap[position],
          transform: `translate(-50%, -50%) translate(${parallaxX * 0.2}px, ${parallaxY * 0.2}px) scale(${1 + scrollProgress * 0.3})`,
          background: `radial-gradient(ellipse at center, ${colors.glow} 0%, ${colors.secondary} 30%, transparent 60%)`,
          filter: `blur(70px)`,
          opacity: intensity * 0.5 * scrollProgress,
          mixBlendMode: "screen",
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

