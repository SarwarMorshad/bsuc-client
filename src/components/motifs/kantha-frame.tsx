/**
 * KanthaFrame — a wide, ornate quilt border: three concentric running-stitch
 * rows in different thread colors with a six-petal folk flower at each corner.
 */
function CornerFlower({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={`absolute h-7 w-7 ${className}`}
      aria-hidden="true"
    >
      <g transform="translate(20 20)">
        {[0, 60, 120, 180, 240, 300].map((a) => (
          <ellipse
            key={a}
            cx={0}
            cy={-9}
            rx={3.6}
            ry={6}
            fill="var(--color-marigold)"
            stroke="#faf6ec"
            strokeWidth={0.8}
            transform={`rotate(${a})`}
          />
        ))}
        <circle r={4} fill="var(--color-madder)" />
      </g>
    </svg>
  );
}

export function KanthaFrame() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <div className="absolute inset-4 rounded-[3px] border-2 border-dashed border-madder/70 sm:inset-7" />
      <div className="absolute inset-[22px] rounded-[3px] border border-dashed border-indigo/50 sm:inset-9" />
      <div className="absolute inset-7 rounded-[3px] border border-dotted border-bd-green/40 sm:inset-11" />
      <CornerFlower className="top-1.5 left-1.5 sm:top-3.5 sm:left-3.5" />
      <CornerFlower className="top-1.5 right-1.5 sm:top-3.5 sm:right-3.5" />
      <CornerFlower className="bottom-1.5 left-1.5 sm:bottom-3.5 sm:left-3.5" />
      <CornerFlower className="right-1.5 bottom-1.5 sm:right-3.5 sm:bottom-3.5" />
    </div>
  );
}
