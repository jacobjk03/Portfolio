"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, X, Sparkles } from "lucide-react";
import { resumeData } from "@/config/resume-data";
import NeonDNALoader from "./NeonDNALoader";

export default function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [filter, setFilter] = useState<"all" | "featured">("all");
  const [showLoader, setShowLoader] = useState(false);
  const [showContent, setShowContent] = useState(false);

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

  const filteredProjects = filter === "featured" 
    ? resumeData.projects.filter(p => p.featured)
    : resumeData.projects;

  // Handle project modal opening with loader
  const handleProjectClick = (index: number) => {
    setSelectedProject(index);
    setShowLoader(true);
    setShowContent(false);

    // Show loader for minimum 500ms, then fade into content
    setTimeout(() => {
      setShowLoader(false);
      setShowContent(true);
    }, 600);
  };

  // Handle modal closing
  const handleCloseModal = () => {
    setSelectedProject(null);
    setShowLoader(false);
    setShowContent(false);
  };

  // Reset states when project changes
  useEffect(() => {
    if (selectedProject !== null) {
      setShowLoader(true);
      setShowContent(false);
      const timer = setTimeout(() => {
        setShowLoader(false);
        setShowContent(true);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [selectedProject]);

  return (
    <section id="projects" className="py-20" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Featured Projects</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mx-auto rounded-full mb-4" />
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Here are some of my recent projects that showcase my skills and experience
          </p>

          {/* Filter Buttons */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setFilter("all")}
              className={`px-6 py-2 rounded-full transition-all ${
                filter === "all"
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "bg-secondary hover:bg-secondary/80"
              }`}
            >
              All Projects
            </button>
            <button
              onClick={() => setFilter("featured")}
              className={`px-6 py-2 rounded-full transition-all flex items-center gap-2 ${
                filter === "featured"
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "bg-secondary hover:bg-secondary/80"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Featured Only
            </button>
          </div>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredProjects.map((project, index) => (
            <motion.div
              key={index}
              variants={item}
              whileHover={{ y: -8 }}
              onClick={() => handleProjectClick(index)}
              className="group cursor-pointer rounded-xl overflow-hidden bg-secondary/50 border border-border hover:border-primary/50 transition-all shadow-lg hover:shadow-xl glass-edge-glow"
            >
              <div className="aspect-video bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 flex items-center justify-center text-6xl relative overflow-hidden">
                {project.image && project.image.startsWith('/assets/') ? (
                  <>
                    <img
                      src={project.image}
                      alt={project.title}
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/20 group-hover:from-blue-500/10 group-hover:to-purple-500/30 transition-all" />
                  </>
                ) : (
                  <>
                    <div className="relative z-10">🚀</div>
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/20 group-hover:from-blue-500/10 group-hover:to-purple-500/30 transition-all" />
                  </>
                )}
                {project.featured && (
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium flex items-center gap-1 z-20">
                    <Sparkles className="w-3 h-3" />
                    Featured
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/20"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/20">
                      +{project.technologies.length - 3}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-muted-foreground">
                  {project.github && (
                    <div className="flex items-center gap-1 text-sm">
                      <Github className="w-4 h-4" />
                      Code
                    </div>
                  )}
                  {project.link && (
                    <div className="flex items-center gap-1 text-sm">
                      <ExternalLink className="w-4 h-4" />
                      Demo
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Neon DNA Loader */}
        <AnimatePresence>
          {selectedProject !== null && showLoader && (
            <NeonDNALoader isVisible={showLoader} />
          )}
        </AnimatePresence>

        {/* Project Modal */}
        <AnimatePresence>
          {selectedProject !== null && showContent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              onClick={handleCloseModal}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                onClick={(e) => e.stopPropagation()}
                className="bg-background rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-border shadow-2xl"
              >
                <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border p-6 flex items-start justify-between z-10">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-2xl font-bold">
                        {resumeData.projects[selectedProject].title}
                      </h3>
                      {resumeData.projects[selectedProject].featured && (
                        <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          Featured
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                      {resumeData.projects[selectedProject].github && (
                        <a
                          href={resumeData.projects[selectedProject].github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Github className="w-4 h-4" />
                          View Code
                        </a>
                      )}
                      {resumeData.projects[selectedProject].link && (
                        <a
                          href={resumeData.projects[selectedProject].link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="w-4 h-4" />
                          Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={handleCloseModal}
                    className="p-2 hover:bg-secondary rounded-lg transition-colors"
                    aria-label="Close modal"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="p-6">
                  {/* Project Image Container - Consistent styling for all screenshots */}
                  <div className="rounded-xl bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 p-4 mb-6 flex items-center justify-center min-h-[300px]">
                    {resumeData.projects[selectedProject].image && resumeData.projects[selectedProject].image.startsWith('/assets/') ? (
                      <img
                        src={resumeData.projects[selectedProject].image}
                        alt={resumeData.projects[selectedProject].title}
                        className="rounded-xl shadow-lg max-w-full max-h-[520px] md:max-h-[600px] mx-auto object-contain"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="text-8xl">🚀</div>
                    )}
                  </div>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-lg mb-3">About This Project</h4>
                      <p className="text-muted-foreground leading-relaxed">
                        {resumeData.projects[selectedProject].longDescription ||
                          resumeData.projects[selectedProject].description}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-3">Technologies Used</h4>
                      <div className="flex flex-wrap gap-2">
                        {resumeData.projects[selectedProject].technologies.map((tech) => (
                          <span
                            key={tech}
                            className="px-3 py-2 text-sm rounded-lg bg-primary/10 text-primary border border-primary/20 font-medium"
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
    </section>
  );
}

