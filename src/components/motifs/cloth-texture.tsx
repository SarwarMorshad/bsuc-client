/**
 * ClothTexture — a subtle woven-fabric background for a panel. Combines an SVG
 * grain (feTurbulence) with faint warp/weft thread lines so the cream reads as
 * cloth rather than flat paper. Purely decorative.
 */
export function ClothTexture({ className }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ""}`}
      aria-hidden="true"
    >
      {/* Woven warp + weft threads */}
      <div
        className="absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(27,27,26,0.035) 0 1px, transparent 1px 3px), repeating-linear-gradient(0deg, rgba(27,27,26,0.03) 0 1px, transparent 1px 3px)",
        }}
      />
      {/* Fibrous grain */}
      <svg className="absolute inset-0 h-full w-full">
        <filter id="kantha-cloth-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves={2}
            stitchTiles="stitch"
            result="noise"
          />
          <feColorMatrix in="noise" type="saturate" values="0" />
        </filter>
        <rect
          width="100%"
          height="100%"
          filter="url(#kantha-cloth-grain)"
          opacity={0.05}
        />
      </svg>
    </div>
  );
}
