"use client";

import { useRef, useEffect, ReactNode, HTMLAttributes } from "react";
import { useMagneticTilt } from "@/hooks/useMagneticTilt";
import { attachRipple } from "@/utils/ripple";

interface MagneticCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  magnet?: number;
  rotate?: number;
  ripple?: boolean;
  rippleColor?: string;
  glass?: boolean;
}

/**
 * Card with magnetic cursor and parallax tilt effects
 * Optional ripple on click
 */
export function MagneticCard({
  children,
  className = "",
  magnet = 10,
  rotate = 4,
  ripple = false,
  rippleColor,
  glass = true,
  ...props
}: MagneticCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Apply magnetic tilt effect
  useMagneticTilt(ref, { magnet, rotate });

  // Apply ripple effect if enabled
  useEffect(() => {
    if (!ripple || !ref.current) return;
    const cleanup = attachRipple(ref.current, rippleColor);
    return cleanup;
  }, [ripple, rippleColor]);

  const glassStyles = glass
    ? "bg-zinc-900/70 backdrop-blur-lg border border-white/10"
    : "bg-zinc-900";

  return (
    <div
      ref={ref}
      className={`
        magnetic tilt relative overflow-hidden
        rounded-2xl p-6
        ${glassStyles}
        transition-all duration-300
        ${ripple ? "cursor-pointer" : ""}
        ${className}
      `}
      data-ripple={ripple ? "true" : undefined}
      {...props}
    >
      {children}
    </div>
  );
}

