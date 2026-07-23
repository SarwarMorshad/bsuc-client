/**
 * MotifIcon — small folk-embroidery glyphs used to mark cards and list items.
 * Color follows currentColor.
 */
export type MotifName = "flower" | "paisley" | "leaf" | "star";

export function MotifIcon({
  name,
  className,
}: {
  name: MotifName;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      {name === "flower" && (
        <g transform="translate(24 24)" fill="currentColor">
          {[0, 60, 120, 180, 240, 300].map((a) => (
            <ellipse
              key={a}
              cx={0}
              cy={-11}
              rx={5}
              ry={8.5}
              transform={`rotate(${a})`}
            />
          ))}
          <circle r={5} />
        </g>
      )}
      {name === "paisley" && (
        <path
          d="M24 6 C 40 14 42 34 24 42 C 12 36 10 18 24 6 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
          strokeDasharray="5 4"
        />
      )}
      {name === "leaf" && (
        <g fill="currentColor">
          <path d="M24 4 C 38 12 38 30 24 44 C 10 30 10 12 24 4 Z" />
          <path d="M24 8 L24 40" stroke="#faf6ec" strokeWidth={2} />
        </g>
      )}
      {name === "star" && (
        <g stroke="currentColor" strokeWidth={3.5} strokeLinecap="round">
          <line x1="24" y1="8" x2="24" y2="40" />
          <line x1="8" y1="24" x2="40" y2="24" />
          <line x1="13" y1="13" x2="35" y2="35" />
          <line x1="35" y1="13" x2="13" y2="35" />
        </g>
      )}
    </svg>
  );
}
