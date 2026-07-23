/**
 * MotifStrip — a repeating embroidered border band used to separate sections,
 * like the woven strip between panels of a kantha.
 */
export function MotifStrip({ className }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none h-10 w-full ${className ?? ""}`}
      aria-hidden="true"
    >
      <svg className="h-full w-full" preserveAspectRatio="none">
        <defs>
          <pattern
            id="motif-strip"
            width="80"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <line
              x1="0"
              y1="6"
              x2="80"
              y2="6"
              stroke="var(--color-madder)"
              strokeWidth="3"
              strokeDasharray="9 7"
            />
            <line
              x1="0"
              y1="34"
              x2="80"
              y2="34"
              stroke="var(--color-indigo)"
              strokeWidth="3"
              strokeDasharray="9 7"
            />
            <path
              d="M40 12 L52 20 L40 28 L28 20 Z"
              fill="var(--color-marigold)"
            />
            <circle cx="8" cy="20" r="3.5" fill="var(--color-bd-green)" />
            <circle cx="72" cy="20" r="3.5" fill="var(--color-bd-green)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#motif-strip)" />
      </svg>
    </div>
  );
}
