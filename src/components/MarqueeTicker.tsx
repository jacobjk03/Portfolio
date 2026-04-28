"use client";

import { useRef, useEffect } from "react";
import { resumeData } from "@/config/resume-data";

const BASE_SPEED = 0.042; // px per ms at rest

export function MarqueeTicker() {
  const allSkills = resumeData.skills.flatMap((s) => s.items);
  const items = [...allSkills, ...allSkills];

  const trackRef = useRef<HTMLDivElement>(null);
  const hoveredRef = useRef(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let x = 0;
    let lastTime = performance.now();
    let lastScrollY = window.scrollY;
    let currentSpeed = BASE_SPEED;
    let rafId: number;

    const tick = (now: number) => {
      const dt = Math.min(now - lastTime, 50); // cap so tab-switch doesn't jump
      const scrollY = window.scrollY;
      const scrollVelocity = Math.abs(scrollY - lastScrollY) / Math.max(1, dt);

      if (!hoveredRef.current) {
        const targetSpeed = BASE_SPEED + scrollVelocity * 0.004;
        currentSpeed += (targetSpeed - currentSpeed) * 0.07; // lerp toward target

        x -= currentSpeed * dt;

        // seamless loop: when we've moved one full copy width, reset
        const halfWidth = track.scrollWidth / 2;
        if (halfWidth > 0 && x <= -halfWidth) x += halfWidth;

        track.style.transform = `translateX(${x}px)`;
      }

      lastScrollY = scrollY;
      lastTime = now;
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div className="border-y border-foreground/8 py-3 overflow-hidden bg-background select-none">
      <div
        ref={trackRef}
        className="flex w-max"
        onMouseEnter={() => { hoveredRef.current = true; }}
        onMouseLeave={() => { hoveredRef.current = false; }}
      >
        {items.map((skill, i) => (
          <span key={i} className="flex items-center shrink-0">
            <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-foreground/40 px-6 whitespace-nowrap hover:text-primary transition-colors cursor-default">
              {skill}
            </span>
            <span className="w-1 h-1 rounded-full bg-foreground/15 shrink-0" />
          </span>
        ))}
      </div>
    </div>
  );
}
