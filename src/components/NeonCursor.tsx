"use client";

import { useEffect, useRef } from "react";

/**
 * NeonCursor - Premium Cursor Trail Effect
 * 
 * Features:
 * - Subtle neon particle trail following cursor
 * - Activates only on interactive elements (buttons, links, cards)
 * - Gradient colors: #7b61ff (purple) → #00ffe7 (cyan)
 * - Lightweight using requestAnimationFrame
 * - Fades out in <0.4s
 * - Works in both light and dark modes
 */

interface Particle {
  x: number;
  y: number;
  size: number;
  life: number;
  maxLife: number;
  color: string;
}

export default function NeonCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const isHoveringRef = useRef(false);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Track mouse position
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };

      // Create particles only when hovering interactive elements
      if (isHoveringRef.current) {
        createParticle(e.clientX, e.clientY);
      }
    };

    // Detect hover over interactive elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive =
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.classList.contains("card-hover") ||
        target.classList.contains("cursor-pointer") ||
        target.closest("button") ||
        target.closest("a") ||
        target.closest(".card-hover") ||
        target.closest(".cursor-pointer");

      isHoveringRef.current = !!isInteractive;
    };

    // Create a single particle
    const createParticle = (x: number, y: number) => {
      // Limit particle count for performance (reduced for subtlety)
      if (particlesRef.current.length > 8) return;

      const radius = 90; // Reduced spread radius
      const intensity = 0.35; // Reduced intensity

      const colors = ["#7b61ff", "#9d7fff", "#00ffe7", "#5dffea"];
      const particle: Particle = {
        x: x + (Math.random() - 0.5) * radius * 0.15,
        y: y + (Math.random() - 0.5) * radius * 0.15,
        size: Math.random() * 1.5 + 1, // Smaller particles
        life: intensity,
        maxLife: intensity,
        color: colors[Math.floor(Math.random() * colors.length)],
      };
      particlesRef.current.push(particle);
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter((particle) => {
        // Decay life (fade out in 0.4s = 24 frames at 60fps)
        particle.life -= 1 / 24;

        if (particle.life <= 0) return false;

        // Draw particle with subtle glow
        const alpha = particle.life;
        ctx.save();

        // Soft outer glow (reduced from 15 to 8)
        ctx.shadowBlur = 8;
        ctx.shadowColor = particle.color;

        // Particle
        ctx.globalAlpha = alpha * 0.6; // Reduced opacity
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();

        // Subtle inner core
        ctx.globalAlpha = alpha * 0.4;
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 0.3, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();

        return true;
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Start animation loop
    animate();

    // Add event listeners
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-[9999]"
      style={{ mixBlendMode: "screen" }}
    />
  );
}

