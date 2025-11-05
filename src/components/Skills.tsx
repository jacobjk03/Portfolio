"use client";

import { useRef } from "react";
import { resumeData } from "@/config/resume-data";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

/**
 * Skills component with animated progress bars
 * - Each category shows an animated horizontal bar
 * - Bars animate from 0% to target value on scroll into view
 * - Neon gradient colors for fill
 * - Lightweight CSS transitions, no heavy libraries
 */
export default function Skills() {
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.1, rootMargin: "-100px", triggerOnce: true });

  // Calculate proficiency percentage based on number of skills (normalized to 70-100%)
  const calculateProficiency = (itemCount: number): number => {
    // Base proficiency: more items = higher proficiency, but cap between 70-100%
    const maxItems = Math.max(...resumeData.skills.map(s => s.items.length));
    const normalized = (itemCount / maxItems) * 30 + 70; // Scale to 70-100%
    return Math.min(100, Math.max(70, normalized));
  };

  return (
    <section id="skills" className="py-20" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`text-center mb-16 transition-all duration-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Skills & Expertise</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mx-auto rounded-full mb-4" />
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A comprehensive toolkit for building modern, scalable applications
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {resumeData.skills.map((skillGroup, index) => {
            const proficiency = calculateProficiency(skillGroup.items.length);
            const delay = index * 100;
            
            return (
              <div
                key={skillGroup.category}
                className={`p-6 rounded-xl bg-secondary/50 dark:bg-secondary/30 border border-border hover:border-primary/50 transition-all card-hover group ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
                }`}
                style={{ transitionDelay: `${delay}ms` }}
              >
                {/* Category Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <h3 className="text-xl font-semibold text-primary group-hover:gradient-text transition-all">
                      {skillGroup.category}
                    </h3>
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">
                    {Math.round(proficiency)}%
                  </span>
                </div>

                {/* Animated Progress Bar */}
                <div className="mb-4">
                  <div className="relative h-3 bg-gray-200/30 dark:bg-gray-800/30 rounded-full overflow-hidden">
                    {/* Background gradient track */}
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-200/20 to-gray-300/20 dark:from-gray-800/20 dark:to-gray-700/20 rounded-full" />
                    
                    {/* Animated fill with neon gradient */}
                    <div
                      className={`absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out ${
                        isVisible ? "" : "w-0"
                      }`}
                      style={{
                        width: isVisible ? `${proficiency}%` : "0%",
                        background: "linear-gradient(90deg, #8A2BE2 0%, #8B5CF6 50%, #00CFFF 100%)",
                        boxShadow: isVisible 
                          ? "0 0 10px rgba(138, 43, 226, 0.4), 0 0 20px rgba(0, 207, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
                          : "none",
                        transitionDelay: `${delay + 200}ms`,
                        willChange: "width",
                      }}
                    />
                    
                    {/* Glow effect on hover */}
                    <div
                      className="absolute inset-y-0 left-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        width: `${proficiency}%`,
                        background: "linear-gradient(90deg, rgba(138, 43, 226, 0.3) 0%, rgba(0, 207, 255, 0.3) 100%)",
                        filter: "blur(4px)",
                      }}
                    />
                  </div>
                </div>

                {/* Skills Tags */}
                <div className="flex flex-wrap gap-2">
                  {skillGroup.items.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 text-sm rounded-full bg-background border border-border hover:border-primary/50 hover:bg-primary/5 transition-all cursor-default"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
