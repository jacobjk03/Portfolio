"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, X, Sparkles, ArrowRight } from "lucide-react";
import { resumeData } from "@/config/resume-data";
import NeonDNALoader from "./NeonDNALoader";
import { useCardTilt } from "@/hooks/useCardTilt";
import { Scroll3DReveal } from "@/components/Scroll3DReveal";
import { SectionNumber } from "@/components/SectionNumber";
import { AnimatedDivider } from "@/components/AnimatedDivider";

function ProjectCard({ project, index, onClick }: { project: typeof resumeData.projects[0]; index: number; onClick: () => void }) {
  const { cardRef, onMouseMove, onMouseLeave } = useCardTilt(8);
  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      className="card-tilt group cursor-pointer bg-background hover:bg-secondary/40 transition-all duration-500 p-1 relative"
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
        {project.featured && (
          <div className="absolute top-3 right-3 px-2 py-1 bg-primary text-white text-[9px] font-semibold tracking-[0.12em] uppercase flex items-center gap-1 z-10">
            <Sparkles className="w-2.5 h-2.5" />
            Featured
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
  );
}

export default function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [filter, setFilter] = useState<"all" | "featured">("all");
  const [showLoader, setShowLoader] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const filteredProjects = filter === "featured"
    ? resumeData.projects.filter(p => p.featured)
    : resumeData.projects;

  const handleProjectClick = (index: number) => {
    setSelectedProject(index);
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
              <button
                onClick={() => setFilter("all")}
                data-ripple="true" data-ripple-color="rgba(124,58,237,0.3)"
                className={`btn-shimmer px-4 py-2 text-[10px] font-semibold tracking-[0.12em] uppercase transition-all ${
                  filter === "all"
                    ? "bg-primary text-white"
                    : "btn-fill border border-foreground/15 text-foreground/50"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("featured")}
                data-ripple="true" data-ripple-color="rgba(124,58,237,0.3)"
                className={`btn-shimmer px-4 py-2 text-[10px] font-semibold tracking-[0.12em] uppercase transition-all flex items-center gap-1.5 ${
                  filter === "featured"
                    ? "bg-primary text-white"
                    : "btn-fill border border-foreground/15 text-foreground/50"
                }`}
              >
                <Sparkles className="w-3 h-3" />
                Featured
              </button>
            </div>
          </div>
        </div>

        {/* Project grid */}
        <motion.div
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-foreground/8"
        >
          {filteredProjects.map((project, index) => (
            <ProjectCard
              key={index}
              project={project}
              index={index}
              onClick={() => handleProjectClick(index)}
            />
          ))}
        </motion.div>

        {/* Loader */}
        <AnimatePresence>
          {selectedProject !== null && showLoader && (
            <NeonDNALoader isVisible={showLoader} />
          )}
        </AnimatePresence>

        {/* Modal */}
        <AnimatePresence>
          {selectedProject !== null && showContent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={handleCloseModal}
              className="fixed inset-0 bg-foreground/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.97, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.97, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                onClick={(e) => e.stopPropagation()}
                className="bg-background max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-foreground/12 shadow-2xl"
              >
                {/* Modal header */}
                <div className="sticky top-0 bg-background/98 backdrop-blur-sm border-b border-foreground/8 px-8 py-6 flex items-start justify-between z-10">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-serif font-medium text-2xl text-foreground">
                        {resumeData.projects[selectedProject].title}
                      </h3>
                      {resumeData.projects[selectedProject].featured && (
                        <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-semibold tracking-[0.1em] uppercase flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5" />
                          Featured
                        </span>
                      )}
                    </div>
                    <div className="flex gap-5">
                      {resumeData.projects[selectedProject].github && (
                        <a
                          href={resumeData.projects[selectedProject].github}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.1em] uppercase text-foreground/50 hover:text-primary transition-colors"
                        >
                          <Github className="w-3.5 h-3.5" />
                          View Code
                        </a>
                      )}
                      {resumeData.projects[selectedProject].link && (
                        <a
                          href={resumeData.projects[selectedProject].link}
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

                {/* Modal body */}
                <div className="px-8 py-8">
                  <div className="bg-secondary/40 flex items-center justify-center min-h-[280px] mb-8">
                    {resumeData.projects[selectedProject].image?.startsWith("/assets/") ? (
                      <img
                        src={resumeData.projects[selectedProject].image}
                        alt={resumeData.projects[selectedProject].title}
                        className="max-w-full max-h-[500px] object-contain shadow-lg"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="text-8xl">🚀</div>
                    )}
                  </div>
                  <div className="space-y-8">
                    <div>
                      <h4 className="font-serif font-medium text-lg text-foreground mb-3">About This Project</h4>
                      <p className="text-muted-foreground leading-relaxed text-base">
                        {resumeData.projects[selectedProject].longDescription ||
                          resumeData.projects[selectedProject].description}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-serif font-medium text-lg text-foreground mb-4">Technologies Used</h4>
                      <div className="flex flex-wrap gap-2">
                        {resumeData.projects[selectedProject].technologies.map((tech) => (
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
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <AnimatedDivider />
    </section>
  );
}
