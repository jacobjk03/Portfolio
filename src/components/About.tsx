"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Code2, Palette, Zap, Award } from "lucide-react";
import { resumeData } from "@/config/resume-data";

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">About Me</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mx-auto rounded-full" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
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
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -z-10 group-hover:bg-purple-500/20 transition-colors" />
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl -z-10 group-hover:bg-pink-500/20 transition-colors" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-2xl font-bold mb-4">
                Hi, I'm <span className="gradient-text">{resumeData.personal.name.split(" ")[0]}</span>
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                {resumeData.personal.bio}
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                With years of experience in web development, I specialize in creating performant, 
                accessible, and visually stunning applications that solve real-world problems.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  className="p-6 rounded-xl bg-background border border-border hover:border-primary/50 transition-all group card-hover glass-edge-glow"
                >
                  <stat.icon className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
                  <div className="text-3xl font-bold text-primary mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Location & Contact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 1 }}
              className="flex flex-wrap gap-4 pt-4"
            >
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="text-2xl">📍</span>
                <span>{resumeData.personal.location}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="text-2xl">💼</span>
                <span>Available for work</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

