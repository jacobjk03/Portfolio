"use client";

import type React from "react";
import { Code2, Palette, Zap, Award } from "lucide-react";
import { resumeData } from "@/config/resume-data";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

export default function About() {
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.1, rootMargin: "-100px", triggerOnce: true });

  const stats = [
    {
      icon: Code2,
      value: `${resumeData.experience.length}+`,
      label: "Years Experience"
    },
    {
      icon: Zap,
      value: `${resumeData.projects.length}+`,
      label: "Projects Completed"
    },
    {
      icon: Palette,
      value: `${resumeData.skills.reduce((acc, skill) => acc + skill.items.length, 0)}+`,
      label: "Technologies"
    },
    {
      icon: Award,
      value: `${resumeData.certifications?.length || 0}+`,
      label: "Certifications"
    }
  ];

  return (
    <section id="about" className="py-20 bg-secondary/30" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`text-center mb-16 transition-all duration-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">About Me</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mx-auto rounded-full" />
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div
            className={`transition-all duration-500 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            <div className="relative group">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-1">
                <div className="w-full h-full rounded-2xl bg-background flex items-center justify-center overflow-hidden">
                  {resumeData.personal.avatar ? (
                    <img
                      src={resumeData.personal.avatar}
                      alt={resumeData.personal.name}
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  ) : (
                    <div className="text-9xl">👨‍💻</div>
                  )}
                </div>
              </div>
              {/* Reduced blur - using gradients instead */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-500/15 rounded-full opacity-50 -z-10 group-hover:bg-purple-500/15 transition-colors" />
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-purple-500/15 rounded-full opacity-50 -z-10 group-hover:bg-pink-500/15 transition-colors" />
            </div>
          </div>

          <div
            className={`space-y-6 transition-all duration-500 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
            }`}
            style={{ transitionDelay: "400ms" }}
          >
            <div className="space-y-5">
              <h3 className="text-2xl font-bold mb-6">
                Hi, I'm <span className="gradient-text">{resumeData.personal.name.split(" ")[0]}</span>
              </h3>
              
              <div className="space-y-5">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  I build <strong className="text-foreground">Generative AI</strong> systems that go beyond simple chatbots — intelligent agents with reasoning, planning, and autonomous action. My work focuses on <strong className="text-foreground">Agentic AI</strong> using ReAct patterns, tool-use, memory systems, and multi-step orchestration frameworks like LangGraph.
                </p>

                <p className="text-lg text-muted-foreground leading-relaxed">
                  I specialize in <strong className="text-foreground">RAG systems</strong> for factual, context-aware AI, and deploy production-ready LLM pipelines on <strong className="text-foreground">AWS</strong> — ECS Fargate, Lambda, DynamoDB, S3, and CloudFront — ensuring scalable, secure infrastructure for enterprise AI applications.
                </p>

                <p className="text-lg text-muted-foreground leading-relaxed">
                  My approach blends research-driven innovation with production engineering. I work across the full stack: from designing agent workflows and evaluation metrics to building interactive systems with voice, translation, and autonomous decision-making.
                </p>

                <p className="text-lg text-muted-foreground leading-relaxed">
                  Currently at Arizona State University, I'm developing cloud-native AI systems and advancing practical applications of agentic AI, RAG, and scalable ML deployment.
                </p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className={`p-6 rounded-xl bg-background border border-border hover:border-primary/50 transition-all group card-hover glass-edge-glow transition-all duration-500 ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
                  }`}
                  style={{ transitionDelay: `${600 + index * 100}ms` }}
                >
                  <stat.icon className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
                  <div className="text-3xl font-bold text-primary mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Location & Contact */}
            <div
              className={`flex flex-wrap gap-4 pt-4 transition-all duration-500 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
              }`}
              style={{ transitionDelay: "1000ms" }}
            >
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="text-2xl">📍</span>
                <span>{resumeData.personal.location}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="text-2xl">💼</span>
                <span>Available for work</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
