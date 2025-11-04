import { useEffect, useState, RefObject } from "react";

export function useScrollReveal(ref: RefObject<HTMLElement>, threshold: number = 0.3): boolean {
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isRevealed) {
          setIsRevealed(true);
        }
      },
      { threshold }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [ref, threshold, isRevealed]);

  return isRevealed;
}

