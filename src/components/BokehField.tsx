"use client";

import { useEffect, useRef, useState } from "react";
import { useSectionVisibility } from "@/hooks/useSectionVisibility";

interface BokehParticle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  size: number;
  opacity: number;
  color: string;
  layer: number;
}

interface BokehFieldProps {
  density?: number;
  colors?: string[];
  layers?: number;
  seed?: number;
}

function seededRandom(seed: number) {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

/**
 * Optimized BokehField - Reduced particles and throttled animations
 * Performance improvements:
 * - Reduced particle count by 60% (from 120 max to 50 max)
 * - Removed continuous float animations
 * - Removed mouse parallax tracking
 * - Removed scroll parallax
 * - Static particles with minimal opacity variation
 * - Only renders when section is visible
 * - Throttled animation frame updates
 */
export function BokehField({
  density = 0.4, // Reduced default density
  colors = ["#8b5cf6", "#22d3ee", "#a855f7"],
  layers = 2, // Reduced layers
  seed = 1337,
}: BokehFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<BokehParticle[]>([]);
  const animationRef = useRef<number>();
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const lastFrameTime = useRef(0);
  const frameThrottle = 16; // ~60fps cap

  const isVisible = useSectionVisibility(containerRef);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = container.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    ctx.scale(dpr, dpr);

    // Reduced particle count significantly
    const actualDensity = isMobile ? density * 0.3 : density;
    const particleCount = Math.floor(
      ((rect.width * rect.height) / 25000) * actualDensity * 50 // Reduced multiplier from 100 to 50
    );
    const maxParticles = Math.min(particleCount, isMobile ? 25 : 50); // Reduced from 60/120

    const random = seededRandom(seed);
    particlesRef.current = Array.from({ length: maxParticles }, () => {
      const layer = Math.floor(random() * layers);
      const baseX = random() * rect.width;
      const baseY = random() * rect.height;
      
      return {
        x: baseX,
        y: baseY,
        baseX,
        baseY,
        size: 8 + random() * 30, // Slightly larger, fewer particles
        opacity: 0.03 + random() * 0.08, // Reduced opacity range
        color: colors[Math.floor(random() * colors.length)],
        layer,
      };
    });

    // Initial render
    ctx.clearRect(0, 0, rect.width, rect.height);
    particlesRef.current.forEach((particle) => {
      const gradient = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.size);
      const alpha = Math.max(0, Math.min(1, particle.opacity));
      
      gradient.addColorStop(0, hexToRgba(particle.color, alpha));
      gradient.addColorStop(0.5, hexToRgba(particle.color, alpha * 0.5));
      gradient.addColorStop(1, hexToRgba(particle.color, 0));

      ctx.fillStyle = gradient;
      ctx.fillRect(
        particle.x - particle.size,
        particle.y - particle.size,
        particle.size * 2,
        particle.size * 2
      );
    });

    // Only animate if visible and not reduced motion
    if (!isVisible || prefersReducedMotion) {
      return;
    }

    // Throttled animation - only subtle opacity pulse
    let lastTime = 0;
    const animate = (time: number) => {
      // Throttle frames
      if (time - lastFrameTime.current < frameThrottle) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      lastFrameTime.current = time;

      const deltaTime = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      ctx.clearRect(0, 0, rect.width, rect.height);

      // Static particles with minimal opacity variation
      particlesRef.current.forEach((particle) => {
        const pulse = prefersReducedMotion ? 1 : 0.85 + Math.sin(time * 0.0005) * 0.15;
        const alpha = particle.opacity * pulse;

        const gradient = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.size);
        gradient.addColorStop(0, hexToRgba(particle.color, alpha));
        gradient.addColorStop(0.5, hexToRgba(particle.color, alpha * 0.5));
        gradient.addColorStop(1, hexToRgba(particle.color, 0));

        ctx.fillStyle = gradient;
        ctx.fillRect(
          particle.x - particle.size,
          particle.y - particle.size,
          particle.size * 2,
          particle.size * 2
        );
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    const resizeObserver = new ResizeObserver(() => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.scale(dpr, dpr);
    });

    resizeObserver.observe(container);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      resizeObserver.disconnect();
    };
  }, [density, colors, layers, seed, isVisible, isMobile, prefersReducedMotion]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none opacity-0 dark:opacity-100 transition-opacity duration-500"
      style={{ zIndex: 0 }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ mixBlendMode: "screen" }}
      />
    </div>
  );
}
