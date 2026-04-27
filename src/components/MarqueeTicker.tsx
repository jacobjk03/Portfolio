"use client";

import { resumeData } from "@/config/resume-data";

export function MarqueeTicker() {
  const allSkills = resumeData.skills.flatMap((s) => s.items);
  // Duplicate for seamless loop
  const items = [...allSkills, ...allSkills];

  return (
    <div className="border-y border-foreground/8 py-3 overflow-hidden bg-background select-none">
      <div className="marquee-track">
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
