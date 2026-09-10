"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import Results from "@/components/Results";
import Projects from "@/components/Projects";
import Certifications from "@/components/Certifications";
import Blog from "@/components/Blog";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import { VisionSection } from "@/components/VisionSection";
import { MarqueeTicker } from "@/components/MarqueeTicker";

export default function Home() {
  return (
    <main className="min-h-screen">
      <ScrollProgress />
      <Navbar />
      {/* Hero — one atmospheric layer, not three. Bokeh and glass depth were
          stacked on top of the light beams here; together they cost GPU, muddied
          the skill map behind a blur, and read as generic. Light beams stay. */}
      <VisionSection
        enableLightBeams={true}
        lightPosition="center"
        lightColor="amber"
        lightIntensity={0.4}
      >
        <Hero />
      </VisionSection>

      {/* Marquee ticker strip */}
      <MarqueeTicker />

      {/* Content sections carry no decorative layers — the bokeh here was still
          blue/cyan from the old palette and fought the copper accent. */}
      <VisionSection delay={100}>
        <About />
      </VisionSection>

      <VisionSection delay={150}>
        <Skills />
      </VisionSection>

      {/* Experience - No effects */}
      <VisionSection 
        delay={100}
      >
        <Experience />
      </VisionSection>

      {/* Results - measured outcomes, no decorative effects competing with the charts */}
      <VisionSection delay={100}>
        <Results />
      </VisionSection>

      <VisionSection delay={150}>
        <Projects />
      </VisionSection>

      <VisionSection delay={100}>
        <Certifications />
      </VisionSection>

      <VisionSection delay={150}>
        <Blog />
      </VisionSection>

      {/* Contact — the page's closing beat gets the second (and last) light beam */}
      <VisionSection
        delay={100}
        enableLightBeams={true}
        lightPosition="right"
        lightColor="amber"
        lightIntensity={0.4}
      >
        <Contact />
      </VisionSection>

      <Footer />
    </main>
  );
}
