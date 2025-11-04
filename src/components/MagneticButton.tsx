"use client";

import { useRef, useEffect, ReactNode, ButtonHTMLAttributes } from "react";
import { useMagneticTilt } from "@/hooks/useMagneticTilt";
import { attachRipple } from "@/utils/ripple";

interface MagneticButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  magnet?: number;
  rotate?: number;
  rippleColor?: string;
  variant?: "primary" | "secondary" | "outline";
}

/**
 * Button with magnetic cursor, parallax tilt, and click ripple effects
 */
export function MagneticButton({
  children,
  className = "",
  magnet = 12,
  rotate = 6,
  rippleColor,
  variant = "primary",
  ...props
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);

  // Apply magnetic tilt effect
  useMagneticTilt(ref, { magnet, rotate });

  // Apply ripple effect
  useEffect(() => {
    if (!ref.current) return;
    const cleanup = attachRipple(ref.current, rippleColor);
    return cleanup;
  }, [rippleColor]);

  // Variant styles
  const variantStyles = {
    primary: "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg hover:shadow-purple-500/50",
    secondary: "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg hover:shadow-blue-500/50",
    outline: "border-2 border-purple-500/50 bg-transparent text-purple-400 hover:bg-purple-500/10",
  };

  return (
    <button
      ref={ref}
      className={`
        magnetic tilt relative overflow-hidden
        rounded-xl px-6 py-3 font-medium
        transition-all duration-300
        ${variantStyles[variant]}
        ${className}
      `}
      data-ripple="true"
      {...props}
    >
      {children}
    </button>
  );
}

