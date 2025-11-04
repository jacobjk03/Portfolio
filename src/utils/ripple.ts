"use client";

/**
 * Creates a glow ripple effect on click
 * Expands from click point and fades out
 * 
 * @param element - The element to attach ripple to
 * @param color - Ripple color (default: purple gradient)
 */
export function attachRipple(
  element: HTMLElement,
  color = "rgba(139, 92, 246, 0.4)"
) {
  // Check for reduced motion
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion) return;

  const handleClick = (e: MouseEvent) => {
    // Get click position relative to element
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Create ripple element
    const ripple = document.createElement("span");
    ripple.className = "glow-ripple";
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.style.setProperty("--ripple-color", color);

    // Ensure parent is positioned
    const position = window.getComputedStyle(element).position;
    if (position === "static") {
      element.style.position = "relative";
    }

    // Ensure overflow hidden for ripple containment
    if (!element.classList.contains("overflow-hidden")) {
      element.style.overflow = "hidden";
    }

    // Add ripple to element
    element.appendChild(ripple);

    // Remove ripple after animation
    setTimeout(() => {
      ripple.remove();
    }, 650);
  };

  element.addEventListener("click", handleClick);

  // Return cleanup function
  return () => {
    element.removeEventListener("click", handleClick);
  };
}

/**
 * Auto-attach ripple to all elements with [data-ripple] attribute
 */
export function initRipples() {
  if (typeof window === "undefined") return;

  const elements = document.querySelectorAll<HTMLElement>("[data-ripple]");
  const cleanups: (() => void)[] = [];

  elements.forEach((element) => {
    const color = element.getAttribute("data-ripple-color") || undefined;
    const cleanup = attachRipple(element, color);
    if (cleanup) cleanups.push(cleanup);
  });

  // Return cleanup function
  return () => {
    cleanups.forEach((cleanup) => cleanup());
  };
}

