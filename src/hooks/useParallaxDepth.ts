import { useEffect, useRef, useState } from "react";

interface ParallaxDepthOptions {
  intensity?: number;
  tilt?: number;
  enableTilt?: boolean;
}

interface ParallaxDepthResult {
  scrollY: number;
  mouseX: number;
  mouseY: number;
  tiltX: number;
  tiltY: number;
}

export function useParallaxDepth({
  intensity = 1,
  tilt = 2,
  enableTilt = true,
}: ParallaxDepthOptions = {}): ParallaxDepthResult {
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const currentRef = useRef({ scrollY: 0, mouseX: 0.5, mouseY: 0.5, tiltX: 0, tiltY: 0 });
  const targetRef = useRef({ scrollY: 0, mouseX: 0.5, mouseY: 0.5, tiltX: 0, tiltY: 0 });
  const [state, setState] = useState<ParallaxDepthResult>({
    scrollY: 0,
    mouseX: 0.5,
    mouseY: 0.5,
    tiltX: 0,
    tiltY: 0,
  });

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const handleScroll = () => {
      targetRef.current.scrollY = window.scrollY * intensity;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isMobile || !enableTilt) return;
      
      targetRef.current.mouseX = e.clientX / window.innerWidth;
      targetRef.current.mouseY = e.clientY / window.innerHeight;
      
      targetRef.current.tiltX = ((targetRef.current.mouseY - 0.5) * tilt);
      targetRef.current.tiltY = ((targetRef.current.mouseX - 0.5) * -tilt);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);
    
    handleScroll();

    let animationFrameId: number;
    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor;
    };

    const animate = () => {
      const lerpFactor = 0.08;

      currentRef.current.scrollY = lerp(currentRef.current.scrollY, targetRef.current.scrollY, lerpFactor);
      currentRef.current.mouseX = lerp(currentRef.current.mouseX, targetRef.current.mouseX, lerpFactor);
      currentRef.current.mouseY = lerp(currentRef.current.mouseY, targetRef.current.mouseY, lerpFactor);
      currentRef.current.tiltX = lerp(currentRef.current.tiltX, targetRef.current.tiltX, lerpFactor);
      currentRef.current.tiltY = lerp(currentRef.current.tiltY, targetRef.current.tiltY, lerpFactor);

      setState({
        scrollY: currentRef.current.scrollY,
        mouseX: currentRef.current.mouseX,
        mouseY: currentRef.current.mouseY,
        tiltX: currentRef.current.tiltX,
        tiltY: currentRef.current.tiltY,
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [intensity, tilt, enableTilt, isMobile, prefersReducedMotion]);

  return state;
}

