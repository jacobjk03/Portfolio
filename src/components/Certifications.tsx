"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { resumeData } from "@/config/resume-data";
import { certLogos, certEmojis, getCleanIssuerName } from "@/data/certLogos";
import { Scroll3DReveal } from "@/components/Scroll3DReveal";
import { SectionNumber } from "@/components/SectionNumber";
import { AnimatedDivider } from "@/components/AnimatedDivider";
import { ScrollTiltSection } from "@/components/ScrollTiltSection";

type Cert = NonNullable<typeof resumeData.certifications>[0];

const SIZE = 260;
const C = SIZE / 2; // 130
const RING_R = 100;
const TEXT_R = 86;
const TICK_COUNT = 72;

function buildTicks() {
  const ticks = [];
  for (let i = 0; i < TICK_COUNT; i++) {
    const angle = (i / TICK_COUNT) * 2 * Math.PI - Math.PI / 2;
    const major = i % 9 === 0;
    const innerR = RING_R + 4;
    const outerR = RING_R + (major ? 13 : 7);
    ticks.push({
      x1: C + innerR * Math.cos(angle),
      y1: C + innerR * Math.sin(angle),
      x2: C + outerR * Math.cos(angle),
      y2: C + outerR * Math.sin(angle),
      major,
    });
  }
  return ticks;
}

const TICKS = buildTicks();

function CertBadge({ cert, index }: { cert: Cert; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [hovered, setHovered] = useState(false);

  const topArcId = `topArc-${index}`;
  const bottomArcId = `bottomArc-${index}`;
  // Top: clockwise left→right via top
  const topArc = `M ${C - TEXT_R},${C} A ${TEXT_R},${TEXT_R} 0 0,1 ${C + TEXT_R},${C}`;
  // Bottom: clockwise right→left via bottom (text reads outward)
  const bottomArc = `M ${C + TEXT_R},${C} A ${TEXT_R},${TEXT_R} 0 0,1 ${C - TEXT_R},${C}`;

  const issuerLabel = getCleanIssuerName(cert.issuer)
    .replace("Google Cloud / Qwiklabs", "Google Cloud")
    .toUpperCase();

  return (
    <motion.div
      ref={ref}
      initial={{ scale: 0, opacity: 0 }}
      animate={isInView ? { scale: 1, opacity: 1 } : {}}
      transition={{ type: "spring", stiffness: 180, damping: 16, delay: index * 0.2 }}
      className="flex flex-col items-center gap-8 group"
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      {/* Badge */}
      <div className="relative" style={{ width: SIZE, height: SIZE }}>

        {/* Glow */}
        <motion.div
          className="absolute inset-0 rounded-full bg-primary/25 blur-3xl"
          animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1.15 : 0.7 }}
          transition={{ duration: 0.5 }}
        />

        {/* Static SVG — rings + arc text */}
        <svg
          width={SIZE} height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="absolute inset-0"
        >
          <defs>
            <path id={topArcId} d={topArc} />
            <path id={bottomArcId} d={bottomArc} />
            <radialGradient id={`bg-${index}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.07" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0.01" />
            </radialGradient>
          </defs>

          {/* Inner fill */}
          <circle cx={C} cy={C} r={RING_R - 1} fill={`url(#bg-${index})`} />

          {/* Main ring */}
          <circle
            cx={C} cy={C} r={RING_R}
            fill="none" stroke="currentColor"
            strokeWidth="1"
            strokeOpacity={hovered ? 0.5 : 0.18}
            style={{ transition: "stroke-opacity 0.35s" }}
          />

          {/* Inner decorative ring */}
          <circle
            cx={C} cy={C} r={RING_R - 18}
            fill="none" stroke="currentColor"
            strokeWidth="0.5" strokeOpacity="0.07"
            strokeDasharray="3 6"
          />

          {/* Cardinal dots */}
          {[0, 90, 180, 270].map((deg) => {
            const rad = (deg - 90) * (Math.PI / 180);
            return (
              <circle
                key={deg}
                cx={C + RING_R * Math.cos(rad)}
                cy={C + RING_R * Math.sin(rad)}
                r="2.5"
                fill="currentColor"
                fillOpacity={hovered ? 0.55 : 0.18}
                style={{ transition: "fill-opacity 0.35s" }}
              />
            );
          })}

          {/* Top arc — date */}
          <text
            fontSize="7.5"
            letterSpacing="3.5"
            fill="currentColor"
            fillOpacity="0.42"
            fontWeight="700"
            fontFamily="monospace"
          >
            <textPath href={`#${topArcId}`} startOffset="50%" textAnchor="middle">
              {cert.date.toUpperCase()}
            </textPath>
          </text>

          {/* Bottom arc — issuer */}
          <text
            fontSize="7.5"
            letterSpacing="2.5"
            fill="currentColor"
            fillOpacity="0.42"
            fontWeight="700"
            fontFamily="monospace"
          >
            <textPath href={`#${bottomArcId}`} startOffset="50%" textAnchor="middle">
              {issuerLabel}
            </textPath>
          </text>
        </svg>

        {/* Rotating tick ring */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{ rotate: hovered ? 360 : 0 }}
          transition={
            hovered
              ? { duration: 20, repeat: Infinity, ease: "linear" }
              : { duration: 2, ease: "easeOut" }
          }
        >
          <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
            {TICKS.map((t, i) => (
              <line
                key={i}
                x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
                stroke="currentColor"
                strokeWidth={t.major ? 1 : 0.5}
                strokeOpacity={t.major ? 0.28 : 0.1}
              />
            ))}
          </svg>
        </motion.div>

        {/* Logo */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ scale: hovered ? 1.08 : 1 }}
            transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
            className="w-16 h-16 flex items-center justify-center"
          >
            {certLogos[cert.issuer] ? (
              <img
                src={certLogos[cert.issuer]}
                alt={getCleanIssuerName(cert.issuer)}
                className="w-full h-full object-contain"
                draggable={false}
              />
            ) : (
              <span className="text-5xl">{certEmojis[cert.issuer] || "🎓"}</span>
            )}
          </motion.div>
        </div>

      </div>

      {/* Name + verify link */}
      <div className="text-center max-w-[210px]">
        <h3 className="font-serif font-medium text-[1.05rem] text-foreground leading-snug mb-3">
          {cert.name}
        </h3>
        {cert.link && (
          <a
            href={cert.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.14em] uppercase text-primary/70 hover:text-primary transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            Verify Certificate
          </a>
        )}
      </div>
    </motion.div>
  );
}

export default function Certifications() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  if (!resumeData.certifications || resumeData.certifications.length === 0) return null;

  return (
    <section
      id="certifications"
      className="py-28 border-b border-foreground/8 relative overflow-hidden"
      ref={ref}
    >
      <SectionNumber number="05" />
      <ScrollTiltSection>
        <div className="max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-20">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="mb-24"
          >
            <Scroll3DReveal>
              <span className="editorial-label block mb-4">Credentials</span>
              <h2 className="font-serif font-medium text-3xl md:text-4xl text-foreground">
                Professional Certifications
              </h2>
            </Scroll3DReveal>
          </motion.div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-16 lg:gap-28">
            {resumeData.certifications.map((cert, index) => (
              <CertBadge key={index} cert={cert} index={index} />
            ))}
          </div>

        </div>
      </ScrollTiltSection>
      <AnimatedDivider />
    </section>
  );
}
