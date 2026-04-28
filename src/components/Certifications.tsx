"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { resumeData } from "@/config/resume-data";
import { certLogos, certEmojis, getCleanIssuerName } from "@/data/certLogos";
import { Scroll3DReveal } from "@/components/Scroll3DReveal";
import { SectionNumber } from "@/components/SectionNumber";
import { AnimatedDivider } from "@/components/AnimatedDivider";

type Cert = NonNullable<typeof resumeData.certifications>[0];

function CertCard({ cert }: { cert: Cert }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
      style={{ perspective: "800px" }}
      className="bg-background"
      onHoverStart={() => setFlipped(true)}
      onHoverEnd={() => setFlipped(false)}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
        style={{ transformStyle: "preserve-3d" }}
        className="relative h-64 w-full"
      >
        {/* Front face */}
        <div
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
          className="absolute inset-0 bg-background p-6 flex flex-col items-center justify-center text-center"
        >
          <div className="w-14 h-14 mb-4 flex items-center justify-center overflow-hidden">
            {certLogos[cert.issuer] ? (
              <img
                src={certLogos[cert.issuer]}
                alt={getCleanIssuerName(cert.issuer)}
                className="w-full h-full object-contain"
              />
            ) : (
              <span className="text-4xl">{certEmojis[cert.issuer] || "🎓"}</span>
            )}
          </div>
          <h3 className="text-xs font-semibold text-foreground leading-tight line-clamp-3 mb-3">
            {cert.name}
          </h3>
          <p className="text-[10px] font-semibold tracking-[0.1em] uppercase text-primary/70">
            {getCleanIssuerName(cert.issuer)}
          </p>
          <span className="absolute bottom-3 text-[9px] text-foreground/20 tracking-[0.08em] uppercase select-none">
            flip
          </span>
        </div>

        {/* Back face */}
        <div
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            pointerEvents: flipped ? "auto" : "none",
          }}
          className="absolute inset-0 bg-foreground p-6 flex flex-col items-center justify-center text-center gap-2"
        >
          <span className="text-[9px] font-semibold tracking-[0.15em] uppercase text-background/40 mb-1">
            Issued by
          </span>
          <p className="text-sm font-semibold text-background leading-tight">
            {getCleanIssuerName(cert.issuer)}
          </p>
          <p className="text-[11px] text-background/50 font-medium">{cert.date}</p>
          {cert.link && (
            <a
              href={cert.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 border border-background/30 text-background text-[10px] font-semibold tracking-[0.1em] uppercase hover:bg-background/10 transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              View Cert
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

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
            <CertCard key={index} cert={cert} />
          ))}
        </motion.div>

      </div>
      <AnimatedDivider />
    </section>
  );
}
