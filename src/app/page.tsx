"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import WorkAuthorizationFAQ from "@/components/WorkAuthorizationFAQ";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Certifications from "@/components/Certifications";
import Blog from "@/components/Blog";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import { VisionSection } from "@/components/VisionSection";

export default function Home() {
  return (
    <main className="min-h-screen">
      <ScrollProgress />
      <Navbar />
      
      {/* Hero - Keep effects for hero section only */}
      <VisionSection 
        enableLightBeams={true}
        lightPosition="center" 
        lightColor="purple" 
        lightIntensity={0.5}
        bokehDensity={0.4}
        bokehColors={["#8b5cf6", "#a855f7", "#c084fc"]}
        bokehSeed={1000}
        enableGlassDepth={true}
        glassIntensity={1.0}
        glassTilt={2}
        glassGlow="purple"
        glassBlur="xl"
      >
        <Hero />
      </VisionSection>

      {/* About - Minimal effects */}
      <VisionSection 
        delay={100} 
        bokehDensity={0.2}
        bokehColors={["#3b82f6", "#60a5fa", "#93c5fd"]}
        bokehSeed={2000}
      >
        <About />
      </VisionSection>

      {/* Work Authorization FAQ */}
      <VisionSection 
        delay={150} 
        bokehDensity={0.15}
        bokehColors={["#8b5cf6", "#a855f7", "#c084fc"]}
        bokehSeed={2500}
      >
        <WorkAuthorizationFAQ />
      </VisionSection>

      {/* Skills - Minimal effects */}
      <VisionSection 
        delay={150} 
        bokehDensity={0.2}
        bokehColors={["#22d3ee", "#06b6d4", "#67e8f9"]}
        bokehSeed={3000}
      >
        <Skills />
      </VisionSection>

      {/* Experience - No effects */}
      <VisionSection 
        delay={100}
      >
        <Experience />
      </VisionSection>

      {/* Projects - Minimal effects */}
      <VisionSection 
        delay={150} 
        bokehDensity={0.25}
        bokehColors={["#3b82f6", "#2563eb", "#60a5fa"]}
        bokehSeed={5000}
      >
        <Projects />
      </VisionSection>

      {/* Certifications - No effects */}
      <VisionSection 
        delay={100}
      >
        <Certifications />
      </VisionSection>

      {/* Blog - No effects */}
      <VisionSection 
        delay={150}
      >
        <Blog />
      </VisionSection>

      {/* Contact - Keep effects for contact section */}
      <VisionSection 
        delay={100} 
        enableLightBeams={true}
        lightPosition="right" 
        lightColor="purple" 
        lightIntensity={0.5}
        bokehDensity={0.3}
        bokehColors={["#8b5cf6", "#a855f7", "#d8b4fe"]}
        bokehSeed={8000}
      >
        <Contact />
      </VisionSection>

      <Footer />
    </main>
  );
}
