/**
 * Lotus — an embroidered lotus / mandala, the classic Nakshi Kantha centerpiece.
 * Two interleaved rings of petals (marigold + green) with cream running-stitch
 * outlines, an indigo stitched ring, and an open cream center to frame a logo.
 * Colors come from the central theme tokens.
 */

const OUTER_PETAL = "M120 120 C 105 78 105 44 120 16 C 135 44 135 78 120 120 Z";
const MID_PETAL = "M120 120 C 110 86 110 58 120 32 C 130 58 130 86 120 120 Z";

const ring = (count: number, start = 0) =>
  Array.from({ length: count }, (_, i) => start + (360 / count) * i);

export function Lotus({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 240"
      className={className}
      aria-hidden="true"
      role="presentation"
    >
      {/* Outer enclosing stitch ring */}
      <circle
        cx={120}
        cy={120}
        r={116}
        fill="none"
        stroke="var(--color-indigo)"
        strokeWidth={1.5}
        strokeDasharray="4 4"
        opacity={0.6}
      />

      {/* Outer petals (marigold) */}
      {ring(12, 0).map((a) => (
        <path
          key={`o-${a}`}
          d={OUTER_PETAL}
          fill="var(--color-marigold)"
          stroke="#faf6ec"
          strokeWidth={1.3}
          strokeDasharray="3 2.5"
          transform={`rotate(${a} 120 120)`}
        />
      ))}

      {/* Middle petals (green), interleaved */}
      {ring(12, 15).map((a) => (
        <path
          key={`m-${a}`}
          d={MID_PETAL}
          fill="var(--color-bd-green)"
          stroke="#faf6ec"
          strokeWidth={1.3}
          strokeDasharray="3 2.5"
          transform={`rotate(${a} 120 120)`}
        />
      ))}

      {/* Center medallion (open, frames the logo) */}
      <circle
        cx={120}
        cy={120}
        r={54}
        fill="var(--color-cream)"
        stroke="var(--color-madder)"
        strokeWidth={2}
        strokeDasharray="5 4"
      />
      <circle
        cx={120}
        cy={120}
        r={47}
        fill="none"
        stroke="var(--color-brand-blue)"
        strokeWidth={1}
        strokeDasharray="3 3"
        opacity={0.5}
      />
    </svg>
  );
}
