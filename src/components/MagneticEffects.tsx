"use client";

import { useEffect } from "react";
import { initRipples } from "@/utils/ripple";

/**
 * Initializes magnetic and ripple effects on mount
 * Auto-applies to elements with .magnetic.tilt and [data-ripple]
 * 
 * Add this component to your layout to enable effects globally
 */
export function MagneticEffects() {
  useEffect(() => {
    // Initialize ripple effects for all [data-ripple] elements
    const cleanupRipples = initRipples();

    // Apply magnetic tilt to all .magnetic.tilt elements
    const magneticElements = document.querySelectorAll<HTMLElement>(".magnetic.tilt");
    
    const cleanupMagnetic = Array.from(magneticElements).map((element) => {
      // Check for reduced motion
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
        return () => {}; // No cleanup needed
      }

      // Get options from data attributes
      const magnet = parseFloat(element.getAttribute("data-magnet") || "12");
      const rotate = parseFloat(element.getAttribute("data-rotate") || "6");
      const spring = 0.15;

      let rafId: number;

      const handleMouseMove = (e: MouseEvent) => {
        if (rafId) return;

        rafId = requestAnimationFrame(() => {
          const rect = element.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;

          const deltaX = e.clientX - centerX;
          const deltaY = e.clientY - centerY;

          // Magnetic effect
          const magnetX = deltaX * spring;
          const magnetY = deltaY * spring;
          const clampedX = Math.max(-magnet, Math.min(magnet, magnetX));
          const clampedY = Math.max(-magnet, Math.min(magnet, magnetY));

          // Parallax tilt
          const rotateX = (deltaY / rect.height) * rotate;
          const rotateY = -(deltaX / rect.width) * rotate;

          // Glow intensity
          const tiltAmount = Math.sqrt(rotateX ** 2 + rotateY ** 2);
          const glowIntensity = Math.min(1, tiltAmount / rotate) * 0.4;

          // Apply transforms
          element.style.transform = `
            translate3d(${clampedX}px, ${clampedY}px, 0)
            perspective(1000px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
          `;

          element.style.filter = `
            drop-shadow(0 ${Math.abs(rotateX) * 2}px ${20 + Math.abs(rotateX) * 3}px rgba(139, 92, 246, ${glowIntensity}))
            drop-shadow(0 ${Math.abs(rotateY)}px ${15 + Math.abs(rotateY) * 2}px rgba(6, 182, 212, ${glowIntensity * 0.6}))
          `;

          rafId = 0 as unknown as number;
        });
      };

      const handleMouseEnter = () => {
        element.style.transition = "transform 0.1s ease-out, filter 0.2s ease";
        element.style.willChange = "transform, filter";
      };

      const handleMouseLeave = () => {
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = 0 as unknown as number;
        }

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
    });

    // Cleanup on unmount
    return () => {
      cleanupRipples?.();
      cleanupMagnetic.forEach((cleanup) => cleanup());
    };
  }, []);

  return null; // This component doesn't render anything
}

