"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
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
      
      <VisionSection 
        enableLightBeams 
        lightPosition="center" 
        lightColor="purple" 
        lightIntensity={0.7}
        bokehDensity={0.9}
        bokehColors={["#8b5cf6", "#a855f7", "#c084fc"]}
        bokehSeed={1000}
        enableGlassDepth
        glassIntensity={1.2}
        glassTilt={3}
        glassGlow="purple"
        glassBlur="xl"
      >
        <Hero />
      </VisionSection>

      <VisionSection 
        delay={100} 
        enableLightBeams 
        lightPosition="left" 
        lightColor="blue" 
        lightIntensity={0.5}
        bokehDensity={0.7}
        bokehColors={["#3b82f6", "#60a5fa", "#93c5fd"]}
        bokehSeed={2000}
        enableGlassDepth
        glassIntensity={0.8}
        glassTilt={2}
        glassGlow="blue"
        glassBlur="2xl"
      >
        <About />
      </VisionSection>

      <VisionSection 
        delay={150} 
        enableLightBeams 
        lightPosition="right" 
        lightColor="cyan" 
        lightIntensity={0.6}
        bokehDensity={0.8}
        bokehColors={["#22d3ee", "#06b6d4", "#67e8f9"]}
        bokehSeed={3000}
      >
        <Skills />
      </VisionSection>

      <VisionSection 
        delay={100} 
        enableLightBeams 
        lightPosition="left" 
        lightColor="purple" 
        lightIntensity={0.55}
        bokehDensity={0.75}
        bokehColors={["#8b5cf6", "#c084fc", "#e9d5ff"]}
        bokehSeed={4000}
      >
        <Experience />
      </VisionSection>

      <VisionSection 
        delay={150} 
        enableLightBeams 
        lightPosition="right" 
        lightColor="blue" 
        lightIntensity={0.6}
        bokehDensity={0.85}
        bokehColors={["#3b82f6", "#2563eb", "#60a5fa"]}
        bokehSeed={5000}
      >
        <Projects />
      </VisionSection>

      <VisionSection 
        delay={100} 
        enableLightBeams 
        lightPosition="center" 
        lightColor="cyan" 
        lightIntensity={0.5}
        bokehDensity={0.7}
        bokehColors={["#22d3ee", "#67e8f9", "#a5f3fc"]}
        bokehSeed={6000}
      >
        <Certifications />
      </VisionSection>

      <VisionSection 
        delay={150} 
        enableLightBeams 
        lightPosition="left" 
        lightColor="blue" 
        lightIntensity={0.55}
        bokehDensity={0.8}
        bokehColors={["#3b82f6", "#60a5fa", "#93c5fd"]}
        bokehSeed={7000}
      >
        <Blog />
      </VisionSection>

      <VisionSection 
        delay={100} 
        enableLightBeams 
        lightPosition="right" 
        lightColor="purple" 
        lightIntensity={0.65}
        bokehDensity={0.9}
        bokehColors={["#8b5cf6", "#a855f7", "#d8b4fe"]}
        bokehSeed={8000}
      >
        <Contact />
      </VisionSection>

      <Footer />
    </main>
  );
}

