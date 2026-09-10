"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, X, ArrowRight, Lock } from "lucide-react";
import { resumeData } from "@/config/resume-data";
import NeonDNALoader from "./NeonDNALoader";
import { useCardTilt } from "@/hooks/useCardTilt";
import { Scroll3DReveal } from "@/components/Scroll3DReveal";
import { SectionNumber } from "@/components/SectionNumber";
import { AnimatedDivider } from "@/components/AnimatedDivider";
import { ScrollTiltSection } from "@/components/ScrollTiltSection";
import { ReasoningTrace } from "@/components/ReasoningTrace";
import { ForecastGame } from "@/components/ForecastGame";

/**
 * Which projects ship an interactive agent trace in their case study.
 * Single source of truth so the card badge and the modal can never disagree —
 * a badge promising a trace that isn't there would be worse than no badge.
 */
function hasTrace(project: typeof resumeData.projects[0]) {
  return /medical/i.test(project.title);
}

function ProjectCard({ project, index, onClick }: { project: typeof resumeData.projects[0]; index: number; onClick: () => void }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { cardRef, onMouseMove, onMouseLeave } = useCardTilt(8);

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start end", "end start"],
  });
  const popScale = useTransform(scrollYProgress, [0, 0.28, 0.5, 0.72, 1], [0.93, 0.97, 1.03, 0.97, 0.93]);
  const popY = useTransform(scrollYProgress, [0, 0.28, 0.5, 0.72, 1], [22, 5, 0, -5, -22]);

  return (
    <motion.div
      ref={scrollRef}
      style={{ scale: popScale, y: popY, willChange: "transform" }}
      className="h-full"
    >
    {/* h-full + justify-center: the card still fills its grid cell (so the
        hairline gap between cells stays unbroken) but its content sits centred.
        Without it, a card sharing a row with the taller game panel stuck to the
        top of the cell with dead space beneath it. */}
    <motion.div
      variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      className="card-tilt group cursor-pointer bg-background hover:bg-secondary/40 transition-all duration-500 p-1 relative h-full flex flex-col justify-center"
    >
      {/* Image */}
      <div className="aspect-video overflow-hidden relative bg-secondary">
        {project.image && project.image.startsWith("/assets/") ? (
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover transition-all duration-700"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl bg-secondary">
            🚀
          </div>
        )}
        <div className="absolute top-3 right-3 px-2 py-1 bg-foreground/80 text-background text-[9px] font-semibold tracking-[0.12em] uppercase z-10">
          {project.category === "team" ? "Team" : "Personal"}
        </div>

        {/* Marks cards that open with a live agent trace inside. Without this
            the trace is invisible until someone happens to click the right
            card — the grid stays uniform, the badge does the advertising. */}
        {hasTrace(project) && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2 py-1 bg-background/90 backdrop-blur-sm border border-primary/30 text-[9px] font-semibold tracking-[0.12em] uppercase text-primary z-10">
            <span className="w-1.5 h-1.5 rounded-full bg-primary avail-dot" />
            Live agent trace
          </div>
        )}

        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-all duration-500" />
      </div>

      {/* Card content */}
      <div className="p-6 pb-8">
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.technologies.slice(0, 2).map((tech) => (
            <span key={tech} className="text-[9px] font-semibold tracking-[0.12em] uppercase border border-foreground/12 px-2 py-0.5 text-foreground/50">
              {tech}
            </span>
          ))}
          {project.technologies.length > 2 && (
            <span className="text-[9px] font-semibold tracking-[0.12em] uppercase border border-foreground/12 px-2 py-0.5 text-foreground/40">
              +{project.technologies.length - 2}
            </span>
          )}
        </div>
        <h3 className="font-serif font-medium text-lg text-foreground mb-3 group-hover:text-primary transition-colors">
          {project.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-6 line-clamp-2 leading-relaxed">
          {project.description}
        </p>
        <span className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.12em] uppercase text-primary group-hover:gap-3 transition-all">
          Explore case
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </motion.div>
    </motion.div>
  );
}

export default function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [selectedProject, setSelectedProject] = useState<typeof resumeData.projects[0] | null>(null);
  const [filter, setFilter] = useState<"all" | "personal" | "team">("all");
  const [showLoader, setShowLoader] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const filteredProjects = filter === "all"
    ? resumeData.projects
    : resumeData.projects.filter(p => p.category === filter);

  // document.body isn't available during SSR, so the portal only mounts client-side.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const handleProjectClick = (project: typeof resumeData.projects[0]) => {
    setSelectedProject(project);
    setShowLoader(true);
    setShowContent(false);
    setTimeout(() => { setShowLoader(false); setShowContent(true); }, 600);
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
    setShowLoader(false);
    setShowContent(false);
  };

  useEffect(() => {
    if (selectedProject !== null) {
      setShowLoader(true);
      setShowContent(false);
      const timer = setTimeout(() => { setShowLoader(false); setShowContent(true); }, 600);
      return () => clearTimeout(timer);
    }
  }, [selectedProject]);

  return (
    <section id="projects" className="py-28 border-b border-foreground/8 relative overflow-hidden" ref={ref}>
      <SectionNumber number="05" />
      <ScrollTiltSection>
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12 lg:px-20">

        {/* Header row */}
        <div
          className={`flex flex-col sm:flex-row sm:items-end justify-between mb-20 gap-6 transition-all duration-500 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div>
            <Scroll3DReveal>
              <span className="editorial-label block mb-4">Selected Work</span>
              <h2 className="font-serif font-medium text-3xl md:text-4xl text-foreground max-w-md">
                Recent case studies.
              </h2>
            </Scroll3DReveal>
          </div>
          <div className="flex gap-3 items-center">
            <span className="text-[10px] font-semibold tracking-[0.15em] uppercase text-foreground/30 hidden sm:block">
              {filteredProjects.length.toString().padStart(2, "0")} Projects
            </span>
            <div className="flex gap-1.5">
              {(["all", "personal", "team"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  data-ripple="true" data-ripple-color="rgba(184, 77, 39,0.3)"
                  className={`btn-shimmer px-4 py-2 text-[10px] font-semibold tracking-[0.12em] uppercase transition-all ${
                    filter === f
                      ? "bg-primary text-white"
                      : "btn-fill border border-foreground/15 text-foreground/50"
                  }`}
                >
                  {f === "all" ? "All" : f === "personal" ? "Personal" : "Team"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Project grid */}
        <motion.div
          key={filter}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-foreground/8"
        >
          {filteredProjects.map((project, index) => (
            <ProjectCard
              key={project.title}
              project={project}
              index={index}
              onClick={() => handleProjectClick(project)}
            />
          ))}

          {/* Fills the empty cells left by an incomplete final row (4 projects
              in a 3-column grid leaves two). Spans 2 columns; if the remaining
              space is narrower, CSS grid drops it to its own row rather than
              overflowing — so it stays tidy under every filter. */}
          <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
            className="lg:col-span-2 bg-background"
          >
            <ForecastGame
              onOpenProject={() => {
                const p = resumeData.projects.find((x) => /walmart/i.test(x.title));
                if (p) handleProjectClick(p);
              }}
            />
          </motion.div>
        </motion.div>

        {/* Loader */}
        <AnimatePresence>
          {selectedProject !== null && showLoader && (
            <NeonDNALoader isVisible={showLoader} />
          )}
        </AnimatePresence>

        {/* Modal — portalled to <body>.
            The section it lives in (.vision-section) keeps `transform:
            translateY(0)` after its entrance animation because of
            `animation-fill-mode: forwards`, and ANY transform (identity
            included) makes that element the containing block for
            position:fixed descendants. The overlay was therefore anchored to
            the section rather than the window, so it opened wherever that
            section happened to sit and the backdrop stopped below the navbar.
            Portalling sidesteps the whole class of problem. */}
        {mounted && createPortal(
        <AnimatePresence>
          {selectedProject !== null && showContent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={handleCloseModal}
              className="fixed inset-0 bg-foreground/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
            >
              <motion.div
                initial={{ y: -16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -12, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                onClick={(e) => e.stopPropagation()}
                className="bg-background max-w-6xl w-full border border-foreground/12 shadow-2xl max-h-[88vh] flex flex-col overflow-hidden"
              >
                {/* Modal header */}
                <div className="bg-background border-b border-foreground/10 px-6 lg:px-8 py-5 flex items-start justify-between z-10 shrink-0">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-serif font-medium text-2xl text-foreground">
                        {selectedProject.title}
                      </h3>
                      <span className="px-2 py-0.5 bg-foreground/8 text-foreground/50 text-[10px] font-semibold tracking-[0.1em] uppercase">
                        {selectedProject.category === "team" ? "Team Project" : "Personal Project"}
                      </span>
                    </div>
                    <div className="flex gap-5">
                      {selectedProject.github && (
                        selectedProject.isPrivate ? (
                          <span
                            className="flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.1em] uppercase text-foreground/35 cursor-default select-none"
                            title="Private team repository — source not publicly available"
                          >
                            <Lock className="w-3.5 h-3.5" />
                            Private Repo · Team Project
                          </span>
                        ) : (
                          <a
                            href={selectedProject.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.1em] uppercase text-foreground/50 hover:text-primary transition-colors"
                          >
                            <Github className="w-3.5 h-3.5" />
                            View Code
                          </a>
                        )
                      )}
                      {selectedProject.link && (
                        <a
                          href={selectedProject.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.1em] uppercase text-foreground/50 hover:text-primary transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={handleCloseModal}
                    className="p-2 text-foreground/40 hover:text-foreground transition-colors"
                    aria-label="Close modal"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Modal body — two columns on desktop: the shot on the left,
                    the reading on the right. Stacked vertically it pushed the
                    description below the fold on every screen, and short
                    viewports clipped the bottom entirely. Each column scrolls
                    on its own only if it needs to. */}
                {/* flex-1 + min-h-0 is what makes the 88vh cap actually bind: a
                    flex child refuses to shrink below its content without
                    min-h-0, so the body used to grow past the cap and spill off
                    the bottom of the screen instead of scrolling inside it.
                    Each column then scrolls independently. */}
                <div className="grid lg:grid-cols-2 gap-0 flex-1 min-h-0">
                  {/* Left — the visual and the stack */}
                  <div className="flex flex-col min-h-0 overflow-y-auto lg:border-r border-foreground/10">
                    <div className="bg-secondary/40 flex items-center justify-center p-6 lg:p-8 shrink-0">
                      {selectedProject.image?.startsWith("/assets/") ? (
                        <img
                          src={selectedProject.image}
                          alt={selectedProject.title}
                          className="max-w-full max-h-[38vh] object-contain shadow-lg"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <div className="text-8xl">🚀</div>
                      )}
                    </div>
                    <div className="px-6 lg:px-8 py-6 shrink-0">
                      <h4 className="font-serif font-medium text-base text-foreground mb-3">
                        Technologies Used
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="px-3 py-1.5 border border-foreground/12 text-[11px] font-semibold tracking-[0.1em] uppercase text-foreground/60"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right — the reading */}
                  <div className="px-6 py-6 lg:px-8 lg:py-8 space-y-7 min-h-0 overflow-y-auto">
                    {hasTrace(selectedProject) && (
                      <ReasoningTrace showAttribution={false} key={selectedProject.title} />
                    )}
                    <div>
                      <h4 className="font-serif font-medium text-lg text-foreground mb-3">About This Project</h4>
                      <p className="text-muted-foreground leading-relaxed text-[15px]">
                        {selectedProject.longDescription || selectedProject.description}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
          document.body
        )}
      </div>
      </ScrollTiltSection>
      <AnimatedDivider />
    </section>
  );
}
