"use client";

import { useRef, useState, useCallback, useEffect } from "react";

const FACES = [
  { label: "Data Scientist",  sub: "ML & Analytics",    pos: "front"  },
  { label: "ML Engineer",     sub: "Model Deployment",  pos: "back"   },
  { label: "NLP Engineer",    sub: "Language Models",   pos: "right"  },
  { label: "Cloud Architect", sub: "AWS & GCP",         pos: "left"   },
  { label: "Jacob Kuriakose", sub: null,                pos: "top"    },
  { label: "",                sub: null,                pos: "bottom" },
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

export default function HeroCube() {
  const [rotX, setRotX] = useState(-18);
  const [rotY, setRotY] = useState(0);
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [autoSpin, setAutoSpin] = useState(true);

  const dragStart = useRef<{ x: number; y: number; rotX: number; rotY: number } | null>(null);
  const animRef = useRef<number | null>(null);
  const lastRotY = useRef(rotY);

  // Auto-spin when not dragging
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
    const newRotY = dragStart.current.rotY + dx * 0.5;
    const newRotX = Math.max(-60, Math.min(60, dragStart.current.rotX - dy * 0.5));
    lastRotY.current = newRotY;
    setRotY(newRotY);
    setRotX(newRotX);
  }, [isDragging]);

  const onMouseUp = useCallback(() => {
    setIsDragging(false);
    dragStart.current = null;
    // Resume auto-spin after 2s idle
    const t = setTimeout(() => setAutoSpin(true), 2000);
    return () => clearTimeout(t);
  }, []);

  // Touch: single finger = rotate, two fingers = pinch-to-zoom
  const touchStart = useRef<{ x: number; y: number; rotX: number; rotY: number } | null>(null);
  const pinchStart = useRef<{ dist: number; scale: number } | null>(null);

  const getPinchDist = (touches: React.TouchList) =>
    Math.hypot(touches[1].clientX - touches[0].clientX, touches[1].clientY - touches[0].clientY);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    setAutoSpin(false);
    if (e.touches.length === 2) {
      pinchStart.current = { dist: getPinchDist(e.touches), scale };
      touchStart.current = null;
    } else {
      pinchStart.current = null;
      const t = e.touches[0];
      touchStart.current = { x: t.clientX, y: t.clientY, rotX, rotY: lastRotY.current };
    }
  }, [rotX, scale]);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    if (e.touches.length === 2 && pinchStart.current) {
      const newDist = getPinchDist(e.touches);
      const ratio = newDist / pinchStart.current.dist;
      setScale(Math.max(0.5, Math.min(2.2, pinchStart.current.scale * ratio)));
    } else if (e.touches.length === 1 && touchStart.current) {
      const t = e.touches[0];
      const dx = t.clientX - touchStart.current.x;
      const dy = t.clientY - touchStart.current.y;
      lastRotY.current = touchStart.current.rotY + dx * 0.5;
      setRotY(lastRotY.current);
      setRotX(Math.max(-60, Math.min(60, touchStart.current.rotX - dy * 0.5)));
    }
  }, []);

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    if (e.touches.length < 2) pinchStart.current = null;
    if (e.touches.length === 0) {
      touchStart.current = null;
      setTimeout(() => setAutoSpin(true), 2000);
    }
  }, []);

  // Global mouseup in case cursor leaves the window while dragging
  useEffect(() => {
    const up = () => { if (isDragging) onMouseUp(); };
    window.addEventListener("mouseup", up);
    return () => window.removeEventListener("mouseup", up);
  }, [isDragging, onMouseUp]);

  // Non-passive touch listeners — required for preventDefault() to block browser pinch-zoom
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault(); // blocks browser viewport zoom on pinch
    };

    el.addEventListener("touchmove", handleTouchMove, { passive: false });
    return () => el.removeEventListener("touchmove", handleTouchMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center select-none"
      style={{ width: SIZE + 80, height: SIZE + 80, perspective: 900, touchAction: "none" }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Hint label */}
      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[9px] font-semibold tracking-[0.12em] uppercase text-foreground/25 whitespace-nowrap pointer-events-none">
        drag to rotate · pinch to zoom
      </span>

      <div
        style={{
          width: SIZE,
          height: SIZE,
          position: "relative",
          transformStyle: "preserve-3d",
          transform: `rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(${scale},${scale},${scale})`,
          transition: isDragging ? "none" : "transform 0.1s ease-out",
          cursor: isDragging ? "grabbing" : "grab",
          willChange: "transform",
        }}
      >
        {FACES.map(({ label, sub, pos }) => (
          <div
            key={pos}
            style={{
              position: "absolute",
              width: SIZE,
              height: SIZE,
              transform: faceTransforms[pos],
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backfaceVisibility: "visible",
              background: pos === "top" ? "#4D77FF" : "rgba(248,247,244,0.95)",
              border: pos === "top" ? "1px solid #4D77FF" : "1px solid rgba(77,119,255,0.15)",
              boxShadow: pos === "front" ? "inset 0 0 40px rgba(77,119,255,0.04)" : "none",
            }}
          >
            {pos !== "bottom" && (
              <div className="flex flex-col items-center justify-center gap-2 px-5 text-center">
                <span
                  className={`font-serif font-medium leading-tight ${
                    pos === "top"
                      ? "text-white text-sm tracking-[0.05em]"
                      : "text-foreground text-lg"
                  }`}
                >
                  {label}
                </span>
                {sub && (
                  <span className="text-[10px] font-semibold tracking-[0.12em] uppercase text-primary/60">
                    {sub}
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
