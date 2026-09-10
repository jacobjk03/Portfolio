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
 * read as noise rather than intent — and it dimmed section content to 0.6
 * opacity at the edges of the viewport, which fought readability.
 *
 * Kept as a no-op (rather than unwrapped from six call sites) so the change is
 * one file and trivially reversible: restore the motion.div here to bring it
 * back. It also removed a transform ancestor that complicated sticky children.
 */
export function ScrollTiltSection({ children, className }: Props) {
  return <div className={className}>{children}</div>;
}
