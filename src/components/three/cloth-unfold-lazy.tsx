"use client";

import dynamic from "next/dynamic";

/**
 * Lazy, client-only loader for the WebGL cloth. `ssr: false` keeps Three.js out
 * of the server render and off the initial bundle until this mounts. The cream
 * fallback shows while it loads (and is the effective reduced-cost baseline).
 */
const ClothUnfold = dynamic(() => import("./cloth-unfold"), {
  ssr: false,
  loading: () => <div className="absolute inset-0" aria-hidden="true" />,
});

export function ClothUnfoldLazy() {
  return (
    <div className="absolute inset-0" aria-hidden="true">
      <ClothUnfold />
    </div>
  );
}
