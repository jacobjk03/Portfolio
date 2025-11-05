import { useEffect, useState } from "react";

/**
 * Hook to defer non-critical animations until after first render
 * Improves first paint and interactivity score
 */
export function useDeferredAnimation(delay: number = 100) {
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    // Defer until after first paint
    const timer = setTimeout(() => {
      setShouldAnimate(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return shouldAnimate;
}

