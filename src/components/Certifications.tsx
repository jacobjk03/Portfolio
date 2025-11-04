"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ExternalLink, Award } from "lucide-react";
import { resumeData } from "@/config/resume-data";
import { certLogos, certEmojis, getCleanIssuerName } from "@/data/certLogos";

export default function Certifications() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Don't render if no certifications
  if (!resumeData.certifications || resumeData.certifications.length === 0) {
    return null;
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section id="certifications" className="py-20 bg-secondary/30" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Certifications</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mx-auto rounded-full mb-4" />
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Professional certifications and continuous learning achievements
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {resumeData.certifications.map((cert, index) => (
            <motion.div
              key={index}
              variants={item}
              whileHover={{ y: -8 }}
              className="group rounded-xl overflow-hidden bg-secondary/50 border border-border hover:border-primary/50 transition-all shadow-lg hover:shadow-xl glass-edge-glow"
            >
              {/* Logo Section with Gradient Background */}
              <div className="relative bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 flex items-center justify-center py-8 px-6 min-h-[140px]">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/20 group-hover:from-blue-500/10 group-hover:to-purple-500/30 transition-all" />
                <div className="relative z-10 w-20 h-20 rounded-xl bg-background/90 backdrop-blur-sm border border-border flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg overflow-hidden p-2">
                  {certLogos[cert.issuer] ? (
                    <img
                      src={certLogos[cert.issuer]}
                      alt={getCleanIssuerName(cert.issuer)}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="text-5xl">{certEmojis[cert.issuer] || "🎓"}</span>
                  )}
                </div>
              </div>

              <div className="p-6">
                {/* Certificate Title */}
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2 min-h-[3.5rem]">
                  {cert.name}
                </h3>

                {/* Issuer */}
                <p className="text-sm text-muted-foreground mb-2 font-medium">
                  {getCleanIssuerName(cert.issuer)}
                </p>

                {/* Date */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4 pb-4 border-b border-border">
                  <Award className="w-4 h-4" />
                  <span>Issued {cert.date}</span>
                </div>

                {/* View Credential Button */}
                {cert.link && (
                  <a
                    href={cert.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all font-medium text-sm shadow-sm hover:shadow-md"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Credential
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}

