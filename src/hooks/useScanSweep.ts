import { useEffect, useState } from "react";

/**
 * Scan Sweep Animation Hook
 * 
 * Creates a smooth vertical scanline animation using requestAnimationFrame.
 * Default duration: 500ms to match form reveal sequence.
 * 
 * @param trigger - Boolean to start the scan animation
 * @param duration - Animation duration in milliseconds (default: 500ms)
 * @returns { isScanning, progress } - Animation state and 0-1 progress value
 */
export function useScanSweep(trigger: boolean, duration: number = 500) {
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!trigger) return;

    setIsScanning(true);
    setProgress(0);

    const startTime = Date.now();
    let animationFrameId: number;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min(elapsed / duration, 1);
      setProgress(newProgress);

      if (newProgress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setIsScanning(false);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [trigger, duration]);

  return { isScanning, progress };
}

