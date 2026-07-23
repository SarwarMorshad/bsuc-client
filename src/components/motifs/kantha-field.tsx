/**
 * KanthaField — the all-over block-printed field: a coral diamond lattice with
 * a sage rosette inside every cell, modelled on a real kantha quilt. Tight,
 * regular and dense rather than randomly scattered.
 */
export function KanthaField({
  className,
  opacity = 0.9,
}: {
  className?: string;
  opacity?: number;
}) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ""}`}
      aria-hidden="true"
    >
      <svg className="h-full w-full">
        <defs>
          <pattern
            id="kantha-lattice"
            width="120"
            height="120"
            patternUnits="userSpaceOnUse"
          >
            {/* Coral diamond lattice (stepped/printed look via dashes) */}
            <path
              d="M60 0 L120 60 L60 120 L0 60 Z"
              fill="none"
              stroke="var(--color-textile-coral)"
              strokeWidth="3.5"
              strokeDasharray="7 5"
              strokeLinecap="square"
            />

            {/* Sage rosette at the centre of each diamond */}
            <g transform="translate(60 60)">
              {[0, 90, 180, 270].map((a) => (
                <ellipse
                  key={a}
                  cx={0}
                  cy={-8}
                  rx={5}
                  ry={8.5}
                  fill="var(--color-textile-sage)"
                  transform={`rotate(${a})`}
                />
              ))}
              {[45, 135, 225, 315].map((a) => (
                <ellipse
                  key={a}
                  cx={0}
                  cy={-7}
                  rx={3.2}
                  ry={6}
                  fill="var(--color-textile-sage-deep)"
                  transform={`rotate(${a})`}
                />
              ))}
              <circle r={3.4} fill="var(--color-textile-ground)" />
            </g>

            {/* Coral seeds at the lattice vertices */}
            {[
              [60, 0],
              [120, 60],
              [60, 120],
              [0, 60],
            ].map(([cx, cy]) => (
              <circle
                key={`${cx}-${cy}`}
                cx={cx}
                cy={cy}
                r={3}
                fill="var(--color-textile-rose)"
              />
            ))}

            {/* Sage dots filling the interstitial cells */}
            {[
              [0, 0],
              [120, 0],
              [0, 120],
              [120, 120],
            ].map(([cx, cy]) => (
              <circle
                key={`c-${cx}-${cy}`}
                cx={cx}
                cy={cy}
                r={4}
                fill="var(--color-textile-sage)"
              />
            ))}
          </pattern>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="url(#kantha-lattice)"
          opacity={opacity}
        />
      </svg>
    </div>
  );
}
