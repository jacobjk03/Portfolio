"use client";

interface Props {
  children: React.ReactNode;
  className?: string;
}

/**
 * Pass-through wrapper.
 *
 * This used to tilt and scale every section in 3D on scroll. It was removed as
 * part of settling on a single motion language: Scroll3DReveal already does a
 * 3D reveal on headings, so a second whole-section 3D transform layered on top
 * read as noise rather than intent, and it dimmed section content to 0.6
 * opacity at the edges of the viewport, which fought readability.
 *
 * Kept as a component (rather than unwrapped from six call sites) so restoring
 * the effect is a one-file change. It renders a Fragment when no className is
 * passed, which none of the callers do: emitting a styleless <div> around every
 * section just added a pointless level of nesting to the DOM.
 */
export function ScrollTiltSection({ children, className }: Props) {
  if (!className) return <>{children}</>;
  return <div className={className}>{children}</div>;
}
