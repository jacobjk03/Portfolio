"use client";

import type React from "react";
import { Briefcase, GraduationCap, Calendar, MapPin } from "lucide-react";
import { resumeData } from "@/config/resume-data";
import { useRecruiterMode } from "@/hooks/useRecruiterMode";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

export default function Experience() {
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.1, rootMargin: "-100px", triggerOnce: true });
  const { isRecruiterMode } = useRecruiterMode();

  return (
    <section id="experience" className="py-20 bg-secondary/30" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`text-center mb-16 transition-all duration-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Experience & Education</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mx-auto rounded-full mb-4" />
          <p className="text-muted-foreground max-w-2xl mx-auto">
            My professional journey and academic background
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Experience Timeline */}
          <div>
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Briefcase className="w-6 h-6 text-primary" />
              </div>
              Work Experience
            </h3>
            <div className="space-y-6">
              {resumeData.experience.map((exp, index) => (
                <div
                  key={index}
                  className={`relative pl-8 pb-8 border-l-2 border-primary/30 last:border-l-0 last:pb-0 group transition-all duration-500 ${
                    isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
                  }`}
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  <div className="absolute left-0 top-1 w-4 h-4 -ml-[9px] rounded-full bg-primary ring-4 ring-background group-hover:scale-125 transition-transform" />
                  
                  <div className={`p-6 rounded-xl bg-background border transition-all card-hover ${
                    isRecruiterMode 
                      ? "border-primary/70 hover:border-primary shadow-lg shadow-primary/20 recruiter-card-glow" 
                      : "border-border hover:border-primary/50"
                  }`}>
                    <h4 className="text-xl font-semibold mb-1 group-hover:text-primary transition-colors">
                      {exp.position}
                    </h4>
                    <p className="text-primary font-medium mb-2">{exp.company}</p>
                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {exp.startDate} - {exp.endDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {exp.location}
                      </span>
                    </div>
                    <ul className="space-y-2 mb-4">
                      {exp.description.map((desc, i) => (
                        <li key={i} className="text-muted-foreground text-sm flex gap-2">
                          <span className="text-primary mt-1.5">•</span>
                          <span className="flex-1">{desc}</span>
                        </li>
                      ))}
                    </ul>
                    {exp.technologies && (
                      <div className="flex flex-wrap gap-2">
                        {exp.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/20"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education Timeline */}
          <div>
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <GraduationCap className="w-6 h-6 text-primary" />
              </div>
              Education
            </h3>
            <div className="space-y-6">
              {resumeData.education.map((edu, index) => (
                <div
                  key={index}
                  className={`relative pl-8 pb-8 border-l-2 border-primary/30 last:border-l-0 last:pb-0 group transition-all duration-500 ${
                    isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
                  }`}
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  <div className="absolute left-0 top-1 w-4 h-4 -ml-[9px] rounded-full bg-primary ring-4 ring-background group-hover:scale-125 transition-transform" />
                  
                  <div className="p-6 rounded-xl bg-background border border-border hover:border-primary/50 transition-all card-hover">
                    <h4 className="text-xl font-semibold mb-1 group-hover:text-primary transition-colors">
                      {edu.degree}
                    </h4>
                    <p className="text-primary font-medium mb-2">{edu.institution}</p>
                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {edu.startDate} - {edu.endDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {edu.location}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm mb-2">
                      <span className="font-medium">Field:</span> {edu.field}
                    </p>
                    {edu.gpa && (
                      <p className="text-muted-foreground text-sm mb-4">
                        <span className="font-medium">GPA:</span> {edu.gpa}
                      </p>
                    )}
                    {edu.achievements && edu.achievements.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">Achievements:</p>
                        <ul className="space-y-1">
                          {edu.achievements.map((achievement, i) => (
                            <li key={i} className="text-muted-foreground text-sm flex gap-2">
                              <span className="text-primary">•</span>
                              <span className="flex-1">{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
