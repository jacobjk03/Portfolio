"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";

/**
 * AIBackdrop - Premium AI Parallax Spotlight Background
 * 
 * Enhanced Features:
 * - Vivid moving gradient nebula behind content
 * - Enhanced parallax: 15px travel range for depth
 * - Sharper orbs (25-35px blur) with higher opacity
 * - Hue shift on scroll for futuristic feel
 * - Animated light sweep every 15s
 * - Apple VisionOS + Vercel + GitHub Universe aesthetic
 * - Smooth fade transitions, no section borders
 * - Mobile-optimized with softer motion
 * - Respects prefers-reduced-motion
 * - Buttery smooth 60fps
 */

export default function AIBackdrop() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const { scrollYProgress } = useScroll();

  // Detect mobile for softer motion
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Smooth spring animations for parallax (softer on mobile)
  const springConfig = isMobile 
    ? { stiffness: 30, damping: 25, mass: 0.8 }
    : { stiffness: 50, damping: 20, mass: 0.5 };
  
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // Enhanced parallax transforms (15px travel range)
  const parallaxRange = isMobile ? 8 : 15;
  const parallaxX1 = useTransform(smoothMouseX, [0, 1], [-parallaxRange, parallaxRange]);
  const parallaxY1 = useTransform(smoothMouseY, [0, 1], [-parallaxRange, parallaxRange]);
  const parallaxX2 = useTransform(smoothMouseX, [0, 1], [parallaxRange * 1.2, -parallaxRange * 1.2]);
  const parallaxY2 = useTransform(smoothMouseY, [0, 1], [parallaxRange * 1.2, -parallaxRange * 1.2]);
  const parallaxX3 = useTransform(smoothMouseX, [0, 1], [-parallaxRange * 0.9, parallaxRange * 0.9]);
  const parallaxY3 = useTransform(smoothMouseY, [0, 1], [parallaxRange * 0.9, -parallaxRange * 0.9]);

  // Scroll-based effects with hue shift
  const scrollOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.9, 0.75, 0.85, 0.7]);
  const scrollY = useTransform(scrollYProgress, [0, 1], [0, -15]);
  const rotation = useTransform(scrollYProgress, [0, 1], [0, 20]);
  const hueRotate = useTransform(scrollYProgress, [0, 1], [0, 15]); // Hue shift for futuristic feel

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Track mouse position (normalized 0-1)
  useEffect(() => {
    if (prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY, prefersReducedMotion]);

  // Disable parallax if reduced motion is preferred
  const parallaxProps = prefersReducedMotion
    ? {}
    : {
        style: { x: parallaxX1, y: parallaxY1 },
      };

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Base dark background */}
      <div className="absolute inset-0 bg-[#0a0a0a]" />

      {/* Animated light sweep (15s cycle, subtle 2% brightness pulse) */}
      <motion.div
        className="absolute inset-0"
        animate={{
          opacity: [0, 0.02, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)",
        }}
      />

      {/* Ambient gradient orbs with parallax and hue shift */}
      <motion.div
        className="absolute inset-0"
        style={{
          opacity: prefersReducedMotion ? 0.7 : scrollOpacity,
          y: prefersReducedMotion ? 0 : scrollY,
          filter: prefersReducedMotion ? "none" : useTransform(hueRotate, (h) => `hue-rotate(${h}deg)`),
        }}
      >
        {/* Purple orb - Top left (sharper, more visible) */}
        <motion.div
          className="absolute -top-[20%] -left-[10%] w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] min-w-[300px] min-h-[300px]"
          style={
            prefersReducedMotion
              ? {}
              : {
                  x: parallaxX1,
                  y: parallaxY1,
                  rotate: rotation,
                }
          }
        >
          <div
            className="w-full h-full rounded-full opacity-50"
            style={{
              background: "radial-gradient(circle, rgba(123, 97, 255, 0.6) 0%, rgba(123, 97, 255, 0.2) 40%, transparent 70%)",
              filter: "blur(30px)",
              mixBlendMode: "screen",
            }}
          />
        </motion.div>

        {/* Cyan/Blue orb - Top right (sharper, more visible) */}
        <motion.div
          className="absolute -top-[10%] -right-[15%] w-[45vw] h-[45vw] max-w-[700px] max-h-[700px] min-w-[350px] min-h-[350px]"
          style={
            prefersReducedMotion
              ? {}
              : {
                  x: parallaxX2,
                  y: parallaxY2,
                  rotate: useTransform(rotation, (r) => -r * 0.8),
                }
          }
        >
          <div
            className="w-full h-full rounded-full opacity-45"
            style={{
              background: "radial-gradient(circle, rgba(59, 130, 246, 0.5) 0%, rgba(0, 255, 231, 0.3) 30%, transparent 60%)",
              filter: "blur(35px)",
              mixBlendMode: "screen",
            }}
          />
        </motion.div>

        {/* Magenta/Pink orb - Center (sharper, more visible) */}
        <motion.div
          className="absolute top-[30%] left-[20%] w-[35vw] h-[35vw] max-w-[500px] max-h-[500px] min-w-[280px] min-h-[280px]"
          style={
            prefersReducedMotion
              ? {}
              : {
                  x: parallaxX3,
                  y: parallaxY3,
                  rotate: useTransform(rotation, (r) => r * 1.2),
                }
          }
        >
          <div
            className="w-full h-full rounded-full opacity-40"
            style={{
              background: "radial-gradient(circle, rgba(236, 72, 153, 0.45) 0%, rgba(168, 85, 247, 0.3) 35%, transparent 65%)",
              filter: "blur(32px)",
              mixBlendMode: "screen",
            }}
          />
        </motion.div>

        {/* Purple accent orb - Bottom right (sharper, more visible) */}
        <motion.div
          className="absolute bottom-[10%] right-[10%] w-[38vw] h-[38vw] max-w-[550px] max-h-[550px] min-w-[300px] min-h-[300px]"
          style={
            prefersReducedMotion
              ? {}
              : {
                  x: useTransform(parallaxX1, (x) => -x * 0.7),
                  y: useTransform(parallaxY1, (y) => -y * 0.7),
                  rotate: useTransform(rotation, (r) => -r * 0.5),
                }
          }
        >
          <div
            className="w-full h-full rounded-full opacity-45"
            style={{
              background: "radial-gradient(circle, rgba(139, 92, 246, 0.5) 0%, rgba(123, 97, 255, 0.25) 40%, transparent 70%)",
              filter: "blur(35px)",
              mixBlendMode: "screen",
            }}
          />
        </motion.div>

        {/* Subtle blue accent - Bottom left (sharper, more visible) */}
        <motion.div
          className="absolute bottom-[20%] left-[5%] w-[30vw] h-[30vw] max-w-[450px] max-h-[450px] min-w-[250px] min-h-[250px]"
          style={
            prefersReducedMotion
              ? {}
              : {
                  x: useTransform(parallaxX2, (x) => x * 0.6),
                  y: useTransform(parallaxY2, (y) => y * 0.6),
                }
          }
        >
          <div
            className="w-full h-full rounded-full opacity-40"
            style={{
              background: "radial-gradient(circle, rgba(96, 165, 250, 0.45) 0%, rgba(59, 130, 246, 0.2) 45%, transparent 70%)",
              filter: "blur(28px)",
              mixBlendMode: "screen",
            }}
          />
        </motion.div>
      </motion.div>

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

