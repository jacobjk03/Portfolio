"use client";

import { resumeData } from "@/config/resume-data";
import { useRecruiterMode } from "@/hooks/useRecruiterMode";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { Scroll3DReveal } from "@/components/Scroll3DReveal";
import { SectionNumber } from "@/components/SectionNumber";

export default function Experience() {
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.1, rootMargin: "-80px", triggerOnce: true });
  const { isRecruiterMode } = useRecruiterMode();

  return (
    <section id="experience" className="py-28 border-b border-foreground/8 relative overflow-hidden" ref={ref}>
      <SectionNumber number="04" />
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-20">

        <div className="mb-20">
          <Scroll3DReveal>
            <span className="editorial-label block mb-4">Background</span>
            <h2 className="font-serif font-medium text-3xl md:text-4xl text-foreground">
              Experience & Education
            </h2>
          </Scroll3DReveal>
        </div>

        <div className="grid lg:grid-cols-2 gap-0">

          {/* Experience — left */}
          <div className="lg:pr-16 lg:border-r border-foreground/10">
            <span className="editorial-label block mb-10">Experience</span>
            <div className="space-y-12">
              {resumeData.experience.map((exp, index) => (
                <div
                  key={index}
                  className={`transition-all duration-600 ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                  } ${isRecruiterMode ? "recruiter-card-glow" : ""}`}
                  style={{ transitionDelay: `${100 + index * 80}ms` }}
                >
                  <span className="text-[10px] font-semibold tracking-[0.15em] uppercase text-foreground/35 block mb-2">
                    {exp.startDate} — {exp.endDate}
                  </span>
                  <h4 className="font-serif font-medium text-xl text-foreground mb-1">
                    {exp.position}
                  </h4>
                  <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-primary mb-4">
                    {exp.company} · {exp.location}
                  </p>
                  <ul className="space-y-2 mb-5">
                    {exp.description.map((desc, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex gap-3 leading-relaxed">
                        <span className="text-primary mt-1.5 shrink-0">—</span>
                        <span>{desc}</span>
                      </li>
                    ))}
                  </ul>
                  {exp.technologies && (
                    <div className="flex flex-wrap gap-1.5">
                      {exp.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 border border-foreground/12 text-[10px] font-semibold tracking-[0.08em] uppercase text-foreground/50"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Education — right */}
          <div className="lg:pl-16 mt-16 lg:mt-0">
            <span className="editorial-label block mb-10">Education</span>
            <div className="space-y-12">
              {resumeData.education.map((edu, index) => (
                <div
                  key={index}
                  className={`transition-all duration-600 ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                  }`}
                  style={{ transitionDelay: `${200 + index * 80}ms` }}
                >
                  <span className="text-[10px] font-semibold tracking-[0.15em] uppercase text-foreground/35 block mb-2">
                    {edu.startDate} — {edu.endDate}
                  </span>
                  <h4 className="font-serif font-medium text-xl text-foreground mb-1">
                    {edu.degree}
                  </h4>
                  <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-primary mb-4">
                    {edu.institution} · {edu.location}
                  </p>
                  <p className="text-sm text-muted-foreground mb-2">
                    <span className="font-medium text-foreground/70">Field: </span>
                    {edu.field}
                  </p>
                  {edu.gpa && (
                    <p className="text-sm text-muted-foreground mb-4">
                      <span className="font-medium text-foreground/70">GPA: </span>
                      {edu.gpa}
                    </p>
                  )}
                  {edu.achievements && edu.achievements.length > 0 && (
                    <ul className="space-y-1.5">
                      {edu.achievements.map((a, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex gap-3">
                          <span className="text-primary shrink-0">—</span>
                          <span>{a}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
