"use client";

import { useRef, useCallback } from "react";

export function useCardTilt(maxDeg = 10) {
  const cardRef = useRef<HTMLDivElement>(null);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotX = (y - 0.5) * -maxDeg;
    const rotY = (x - 0.5) * maxDeg;
    el.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02,1.02,1.02)`;
    el.style.setProperty("--spec-x", `${x * 100}%`);
    el.style.setProperty("--spec-y", `${y * 100}%`);
    el.style.setProperty("--spec-opacity", "1");
  }, [maxDeg]);

  const onMouseLeave = useCallback(() => {
    const el = cardRef.current;
    if (!el) return;
    el.style.transform = "";
    el.style.setProperty("--spec-opacity", "0");
  }, []);

  return { cardRef, onMouseMove, onMouseLeave };
}
