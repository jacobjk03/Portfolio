"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { resumeData } from "@/config/resume-data";
import { certLogos, certEmojis, getCleanIssuerName } from "@/data/certLogos";
import { Scroll3DReveal } from "@/components/Scroll3DReveal";
import { SectionNumber } from "@/components/SectionNumber";

export default function Certifications() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  if (!resumeData.certifications || resumeData.certifications.length === 0) return null;

  return (
    <section id="certifications" className="py-28 border-b border-foreground/8 relative overflow-hidden" ref={ref}>
      <SectionNumber number="06" />
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-20">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-20"
        >
          <Scroll3DReveal>
            <span className="editorial-label block mb-4">Credentials</span>
            <h2 className="font-serif font-medium text-3xl md:text-4xl text-foreground">
              Professional Certifications
            </h2>
          </Scroll3DReveal>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-px bg-foreground/8"
        >
          {resumeData.certifications.map((cert, index) => (
            <motion.div
              key={index}
              variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
              className="group bg-background hover:bg-secondary/40 transition-all duration-300 p-6 flex flex-col items-center text-center"
            >
              {/* Logo or emoji */}
              <div className="w-14 h-14 mb-5 flex items-center justify-center overflow-hidden">
                {certLogos[cert.issuer] ? (
                  <img
                    src={certLogos[cert.issuer]}
                    alt={getCleanIssuerName(cert.issuer)}
                    className="w-full h-full object-contain transition-all duration-500"
                  />
                ) : (
                  <span className="text-4xl">{certEmojis[cert.issuer] || "🎓"}</span>
                )}
              </div>

              {/* Cert name */}
              <h3 className="text-xs font-semibold text-foreground leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-3">
                {cert.name}
              </h3>

              {/* Issuer */}
              <p className="text-[10px] font-semibold tracking-[0.1em] uppercase text-primary/70 mb-3">
                {getCleanIssuerName(cert.issuer)}
              </p>

              {/* Date */}
              <p className="text-[10px] text-foreground/35 mb-4">{cert.date}</p>

              {/* Link */}
              {cert.link && (
                <a
                  href={cert.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.1em] uppercase text-foreground/40 hover:text-primary transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  View
                </a>
              )}
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
