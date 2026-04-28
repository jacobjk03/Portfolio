"use client";

import { useEffect, useRef, ReactNode } from "react";

export function ScrollVelocityTilt({ children }: { children: ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const prevScrollY = useRef(0);
  const currentTilt = useRef(0);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    prevScrollY.current = window.scrollY;
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const tick = () => {
      const scrollY = window.scrollY;
      const velocity = scrollY - prevScrollY.current;
      prevScrollY.current = scrollY;

      // Down = lean forward (negative rotateX), up = lean back (positive)
      const targetTilt = Math.max(-1.8, Math.min(1.8, velocity * -0.16));

      // Smooth lerp — fast attack, gradual spring-back to flat
      currentTilt.current += (targetTilt - currentTilt.current) * 0.1;

      if (Math.abs(currentTilt.current) > 0.004) {
        wrapper.style.transform = `perspective(2000px) rotateX(${currentTilt.current.toFixed(3)}deg)`;
      } else {
        currentTilt.current = 0;
        wrapper.style.transform = "";
      }

      rafId.current = requestAnimationFrame(tick);
    };

    rafId.current = requestAnimationFrame(tick);
    return () => { if (rafId.current) cancelAnimationFrame(rafId.current); };
  }, []);

  return (
    <div
      ref={wrapperRef}
      style={{ transformOrigin: "50% 50%", willChange: "transform" }}
    >
      {children}
    </div>
  );
}
