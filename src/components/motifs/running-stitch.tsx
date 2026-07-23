/**
 * RunningStitch — a hand-stitch style dashed line that "sews" itself in.
 * Color follows the surrounding text color (currentColor); set width via
 * className (e.g. "w-40"). The signature Nakshi Kantha motion.
 */
export function RunningStitch({
  className,
  delayMs = 0,
  animate = true,
}: {
  className?: string;
  delayMs?: number;
  animate?: boolean;
}) {
  return (
    <span
      className={`inline-block ${animate ? "animate-stitch" : ""} ${className ?? ""}`}
      style={animate ? { animationDelay: `${delayMs}ms` } : undefined}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 320 6"
        preserveAspectRatio="none"
        className="h-1.5 w-full"
      >
        <line
          x1="2"
          y1="3"
          x2="318"
          y2="3"
          stroke="currentColor"
          strokeWidth="3"
          strokeDasharray="12 8"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}
