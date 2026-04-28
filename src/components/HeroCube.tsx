"use client";

import { useRef, useState, useCallback, useEffect } from "react";

const FACES = [
  { label: "Data Scientist",  sub: "ML & Analytics",    pos: "front"  },
  { label: "ML Engineer",     sub: "Model Deployment",  pos: "back"   },
  { label: "NLP Engineer",    sub: "Language Models",   pos: "right"  },
  { label: "Cloud Architect", sub: "AWS & GCP",         pos: "left"   },
  { label: "Jacob Kuriakose", sub: null,                pos: "top"    },
  { label: null,              sub: null,                pos: "bottom" },
];

const SIZE = 260;
const HALF = SIZE / 2;

const faceTransforms: Record<string, string> = {
  front:  `translateZ(${HALF}px)`,
  back:   `rotateY(180deg) translateZ(${HALF}px)`,
  right:  `rotateY(90deg) translateZ(${HALF}px)`,
  left:   `rotateY(-90deg) translateZ(${HALF}px)`,
  top:    `rotateX(90deg) translateZ(${HALF}px)`,
  bottom: `rotateX(-90deg) translateZ(${HALF}px)`,
};

const faceShadows: Record<string, React.CSSProperties> = {
  front: { boxShadow: "inset 0 1px 0 rgba(255,255,255,0.9), inset 0 0 60px rgba(77,119,255,0.05)" },
  back:  {},
  right: { boxShadow: "inset -4px 0 20px rgba(0,0,0,0.03)" },
  left:  { boxShadow: "inset 4px 0 20px rgba(0,0,0,0.03)" },
  top:   {},
  bottom:{},
};

const faceClassNames: Record<string, string> = {
  front:  "cube-face",
  back:   "cube-face",
  right:  "cube-face",
  left:   "cube-face",
  top:    "cube-face cube-face-top",
  bottom: "cube-face cube-face-bottom",
};

export default function HeroCube() {
  const [rotX, setRotX] = useState(-18);
  const [rotY, setRotY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [autoSpin, setAutoSpin] = useState(true);

  const dragStart = useRef<{ x: number; y: number; rotX: number; rotY: number } | null>(null);
  const animRef = useRef<number | null>(null);
  const lastRotY = useRef(rotY);

  useEffect(() => {
    if (!autoSpin) return;
    let prev = performance.now();
    const tick = (now: number) => {
      const dt = now - prev;
      prev = now;
      lastRotY.current += dt * 0.025;
      setRotY(lastRotY.current);
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [autoSpin]);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setAutoSpin(false);
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY, rotX, rotY: lastRotY.current };
  }, [rotX]);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !dragStart.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    lastRotY.current = dragStart.current.rotY + dx * 0.5;
    setRotY(lastRotY.current);
    setRotX(Math.max(-60, Math.min(60, dragStart.current.rotX - dy * 0.5)));
  }, [isDragging]);

  const onMouseUp = useCallback(() => {
    setIsDragging(false);
    dragStart.current = null;
    setTimeout(() => setAutoSpin(true), 2000);
  }, []);

  const touchStart = useRef<{ x: number; y: number; rotX: number; rotY: number } | null>(null);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    setAutoSpin(false);
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY, rotX, rotY: lastRotY.current };
  }, [rotX]);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const t = e.touches[0];
    const dx = t.clientX - touchStart.current.x;
    const dy = t.clientY - touchStart.current.y;
    lastRotY.current = touchStart.current.rotY + dx * 0.5;
    setRotY(lastRotY.current);
    setRotX(Math.max(-60, Math.min(60, touchStart.current.rotX - dy * 0.5)));
  }, []);

  const onTouchEnd = useCallback(() => {
    touchStart.current = null;
    setTimeout(() => setAutoSpin(true), 2000);
  }, []);

  useEffect(() => {
    const up = () => { if (isDragging) onMouseUp(); };
    window.addEventListener("mouseup", up);
    return () => window.removeEventListener("mouseup", up);
  }, [isDragging, onMouseUp]);

  return (
    <div
      className="relative flex items-center justify-center select-none"
      style={{ width: SIZE + 80, height: SIZE + 100, perspective: 900, touchAction: "pan-y" }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(77,119,255,0.10) 0%, transparent 70%)",
        }}
      />

      {/* Cube */}
      <div
        style={{
          width: SIZE,
          height: SIZE,
          position: "relative",
          transformStyle: "preserve-3d",
          transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`,
          transition: isDragging ? "none" : "transform 0.1s ease-out",
          cursor: isDragging ? "grabbing" : "grab",
          willChange: "transform",
        }}
      >
        {FACES.map(({ label, sub, pos }) => (
          <div
            key={pos}
            className={faceClassNames[pos]}
            style={{
              position: "absolute",
              width: SIZE,
              height: SIZE,
              transform: faceTransforms[pos],
              ...faceShadows[pos],
            }}
          >
            {pos === "bottom" ? (
              /* Bottom face — dot grid accent */
              <div style={{ width: "100%", height: "100%", opacity: 0.25, backgroundImage: "radial-gradient(circle, rgba(77,119,255,0.8) 1px, transparent 1px)", backgroundSize: "18px 18px" }} />
            ) : pos === "top" ? (
              /* Top face — name with shimmer overlay */
              <div className="flex flex-col items-center justify-center gap-2 px-5 text-center relative w-full h-full">
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 50%)", pointerEvents: "none" }} />
                <span className="font-serif font-medium text-white text-sm tracking-[0.06em] leading-tight relative z-10">
                  {label}
                </span>
                <div style={{ width: 28, height: 1, background: "rgba(255,255,255,0.35)" }} />
                <span className="text-[9px] font-semibold tracking-[0.16em] uppercase text-white/60 relative z-10">
                  Portfolio
                </span>
              </div>
            ) : (
              /* Side faces */
              <div className="flex flex-col items-center justify-center gap-0 px-5 text-center">
                <span className="font-serif font-medium text-foreground text-[17px] leading-tight mb-3">
                  {label}
                </span>
                {sub && (
                  <>
                    <div style={{ width: 24, height: 1, background: "rgba(77,119,255,0.3)", marginBottom: 8 }} />
                    <span className="text-[9px] font-semibold tracking-[0.14em] uppercase text-primary/55">
                      {sub}
                    </span>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Floor shadow */}
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: 8,
          left: "50%",
          transform: "translateX(-50%)",
          width: SIZE * 0.75,
          height: 20,
          background: "radial-gradient(ellipse, rgba(77,119,255,0.18) 0%, transparent 70%)",
          filter: "blur(6px)",
        }}
      />

      {/* Hint */}
      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[9px] font-semibold tracking-[0.12em] uppercase text-foreground/25 whitespace-nowrap pointer-events-none">
        drag to rotate
      </span>
    </div>
  );
}
