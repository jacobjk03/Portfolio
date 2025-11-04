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
  vx: number;
  vy: number;
  phase: number;
  floatPhase: number;
  floatSpeed: number;
  floatAmplitudeX: number;
  floatAmplitudeY: number;
  glowPhase: number;
  glowSpeed: number;
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

export function BokehField({
  density = 0.8,
  colors = ["#8b5cf6", "#22d3ee", "#a855f7"],
  layers = 3,
  seed = 1337,
}: BokehFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<BokehParticle[]>([]);
  const animationRef = useRef<number>();
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const scrollOffsetRef = useRef(0);
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

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

    const actualDensity = isMobile ? density * 0.5 : density;
    const particleCount = Math.floor(
      ((rect.width * rect.height) / 15000) * actualDensity * 100
    );
    const maxParticles = Math.min(particleCount, isMobile ? 60 : 120);

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
        size: 6 + random() * 42,
        opacity: 0.04 + random() * 0.14,
        color: colors[Math.floor(random() * colors.length)],
        layer,
        vx: (random() - 0.5) * 0.15,
        vy: (random() - 0.5) * 0.15,
        phase: random() * Math.PI * 2,
        floatPhase: random() * Math.PI * 2,
        floatSpeed: 0.03 + random() * 0.09,
        floatAmplitudeX: 5 + random() * 10,
        floatAmplitudeY: 8 + random() * 12,
        glowPhase: random() * Math.PI * 2,
        glowSpeed: 0.12 + random() * 0.18,
      };
    });

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      };
    };

    const handleScroll = () => {
      const rect = container.getBoundingClientRect();
      scrollOffsetRef.current = -rect.top / window.innerHeight;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);
    handleScroll();

    let lastTime = 0;
    const animate = (time: number) => {
      if (!isVisible || prefersReducedMotion) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const deltaTime = time - lastTime;
      lastTime = time;
      const deltaSeconds = Math.min(deltaTime / 1000, 0.1);

      ctx.clearRect(0, 0, rect.width, rect.height);

      particlesRef.current.forEach((particle) => {
        if (!prefersReducedMotion) {
          particle.floatPhase += particle.floatSpeed * deltaSeconds;
          particle.glowPhase += particle.glowSpeed * deltaSeconds;

          const floatX = Math.sin(particle.floatPhase) * particle.floatAmplitudeX;
          const floatY = Math.cos(particle.floatPhase * 0.7) * particle.floatAmplitudeY;

          particle.x = particle.baseX + floatX;
          particle.y = particle.baseY + floatY;

          particle.phase += 0.6 * deltaSeconds;
        }

        const layerFactor = (particle.layer + 1) / layers;
        const parallaxX = (mouseRef.current.x - 0.5) * 4 * layerFactor;
        const parallaxY = (mouseRef.current.y - 0.5) * 4 * layerFactor;
        const scrollParallax = scrollOffsetRef.current * 15 * (1 - layerFactor);

        const x = particle.x + parallaxX;
        const y = particle.y + parallaxY + scrollParallax;

        const glowIntensity = prefersReducedMotion
          ? 1
          : 0.3 + Math.sin(particle.glowPhase) * 0.7;
        
        const pulseOpacity = prefersReducedMotion
          ? particle.opacity
          : particle.opacity * glowIntensity;

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, particle.size);
        const alpha = Math.max(0, Math.min(1, pulseOpacity));
        const alphaMid = Math.max(0, Math.min(1, pulseOpacity * 0.5));
        
        gradient.addColorStop(0, hexToRgba(particle.color, alpha));
        gradient.addColorStop(0.5, hexToRgba(particle.color, alphaMid));
        gradient.addColorStop(1, hexToRgba(particle.color, 0));

        ctx.fillStyle = gradient;
        ctx.filter = `blur(${particle.size * 0.5}px)`;
        ctx.fillRect(
          x - particle.size,
          y - particle.size,
          particle.size * 2,
          particle.size * 2
        );
        ctx.filter = "none";
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
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
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

