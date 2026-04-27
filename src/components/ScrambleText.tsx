"use client";

import { useState, useCallback, useRef } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

interface Props {
  text: string;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export function ScrambleText({ text, className, as: Tag = "span" }: Props) {
  const [displayed, setDisplayed] = useState(text);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const scramble = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    let frame = 0;
    const totalFrames = text.length * 2.5;

    intervalRef.current = setInterval(() => {
      setDisplayed(
        text
          .split("")
          .map((char, i) => {
            if (char === " " || char === "." || char === "," || char === "\n") return char;
            if (i < frame / 2.5) return char;
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );
      frame++;
      if (frame >= totalFrames) {
        clearInterval(intervalRef.current!);
        setDisplayed(text);
      }
    }, 22);
  }, [text]);

  const AnyTag = Tag as any;
  return (
    <AnyTag className={className} onMouseEnter={scramble}>
      {displayed}
    </AnyTag>
  );
}
