"use client";

import { ReactLenis } from "lenis/react";

/**
 * Smooth-scroll wrapper (Lenis). Drives the whole page so scroll-driven
 * panel animations feel fluid. `root` binds Lenis to window scrolling.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.1, smoothWheel: true }}>
      {children}
    </ReactLenis>
  );
}
