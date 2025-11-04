"use client";

import { useEffect, RefObject } from "react";

interface MagneticTiltOptions {
  magnet?: number; // Max pixels to move (default: 12)
  rotate?: number; // Max degrees to rotate (default: 6)
  spring?: number; // Spring stiffness (default: 0.15)
  enabled?: boolean; // Enable/disable effect (default: true)
}

/**
 * Magnetic cursor effect with parallax tilt
 * Elements move toward cursor and tilt based on pointer position
 * 
 * @param ref - React ref to the element
 * @param options - Configuration options
 */
export function useMagneticTilt<T extends HTMLElement>(
  ref: RefObject<T>,
  options: MagneticTiltOptions = {}
) {
  const {
    magnet = 12,
    rotate = 6,
    spring = 0.15,
    enabled = true,
  } = options;

  useEffect(() => {
    if (!enabled) return;

    const element = ref.current;
    if (!element) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      // Fallback to simple hover shadow
      element.style.transition = "box-shadow 0.3s ease";
      const handleMouseEnter = () => {
        element.style.boxShadow = "0 10px 40px rgba(139, 92, 246, 0.3)";
      };
      const handleMouseLeave = () => {
        element.style.boxShadow = "";
      };
      element.addEventListener("mouseenter", handleMouseEnter);
      element.addEventListener("mouseleave", handleMouseLeave);
      return () => {
        element.removeEventListener("mouseenter", handleMouseEnter);
        element.removeEventListener("mouseleave", handleMouseLeave);
      };
    }

    // Check if touch device
    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) {
      // Disable tilt on mobile, keep simple transform
      return;
    }

    let rafId: number;
    let isHovering = false;

    const handleMouseMove = (e: MouseEvent) => {
      if (!element || rafId) return;

      rafId = requestAnimationFrame(() => {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Calculate distance from center
        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;

        // Magnetic effect (move toward cursor)
        const magnetX = deltaX * spring;
        const magnetY = deltaY * spring;

        // Clamp to max magnet distance
        const clampedX = Math.max(-magnet, Math.min(magnet, magnetX));
        const clampedY = Math.max(-magnet, Math.min(magnet, magnetY));

        // Parallax tilt (rotate based on position)
        const rotateX = (deltaY / rect.height) * rotate;
        const rotateY = -(deltaX / rect.width) * rotate;

        // Calculate glow intensity based on tilt amount
        const tiltAmount = Math.sqrt(rotateX ** 2 + rotateY ** 2);
        const glowIntensity = Math.min(1, tiltAmount / rotate) * 0.4;

        // Apply transforms
        element.style.transform = `
          translate3d(${clampedX}px, ${clampedY}px, 0)
          perspective(1000px)
          rotateX(${rotateX}deg)
          rotateY(${rotateY}deg)
        `;

        // Apply glow shadow based on tilt
        element.style.filter = `
          drop-shadow(0 ${Math.abs(rotateX) * 2}px ${20 + Math.abs(rotateX) * 3}px rgba(139, 92, 246, ${glowIntensity}))
          drop-shadow(0 ${Math.abs(rotateY)}px ${15 + Math.abs(rotateY) * 2}px rgba(6, 182, 212, ${glowIntensity * 0.6}))
        `;

        rafId = 0 as unknown as number;
      });
    };

    const handleMouseEnter = () => {
      isHovering = true;
      element.style.transition = "transform 0.1s ease-out, filter 0.2s ease";
      element.style.willChange = "transform, filter";
    };

    const handleMouseLeave = () => {
      isHovering = false;
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0 as unknown as number;
      }

      // Spring back to original position
      element.style.transition = "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.3s ease";
      element.style.transform = "translate3d(0, 0, 0) perspective(1000px) rotateX(0deg) rotateY(0deg)";
      element.style.filter = "none";
      element.style.willChange = "auto";
    };

    element.addEventListener("mouseenter", handleMouseEnter);
    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      element.removeEventListener("mouseenter", handleMouseEnter);
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseleave", handleMouseLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [ref, magnet, rotate, spring, enabled]);
}

