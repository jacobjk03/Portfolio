import { useEffect, useRef, useState } from "react";
import type React from "react";

interface UseIntersectionObserverOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

/**
 * Lightweight IntersectionObserver hook for fade/translate reveals
 * Replaces heavy Framer Motion scroll triggers
 */
export function useIntersectionObserver({
  threshold = 0.1,
  rootMargin = "0px 0px -50px 0px",
  triggerOnce = true,
}: UseIntersectionObserverOptions = {}) {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // If reduced motion preferred, show immediately
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    // Check if element is already in viewport on mount
    const rect = element.getBoundingClientRect();
    const isInViewport =
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth);

    // If already in viewport (like Hero section), show immediately
    if (isInViewport) {
      setIsVisible(true);
      if (triggerOnce) setHasAnimated(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && (!triggerOnce || !hasAnimated)) {
            setIsVisible(true);
            if (triggerOnce) {
              setHasAnimated(true);
              observer.unobserve(element);
            }
          } else if (!triggerOnce && !entry.isIntersecting) {
            setIsVisible(false);
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce, hasAnimated]);

  return { ref, isVisible };
}

