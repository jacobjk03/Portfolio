"use client";

import { resumeData } from "@/config/resume-data";

export function MarqueeTicker() {
  const allSkills = resumeData.skills.flatMap((s) => s.items);
  const items = [...allSkills, ...allSkills];

  return (
    <>
      {/* Keyframes inlined so they survive Next.js CSS optimization in production */}
      <style>{`
        @keyframes marquee-ticker {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .marquee-ticker-track {
          display: flex;
          width: max-content;
          animation: marquee-ticker 28s linear infinite;
        }
        .marquee-ticker-track:hover {
          animation-play-state: paused;
        }
      `}</style>
      <div className="border-y border-foreground/8 py-3 overflow-hidden bg-background select-none">
        <div className="marquee-ticker-track">
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
    </>
  );
}
