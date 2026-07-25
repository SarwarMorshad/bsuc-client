/**
 * WelcomePanel — the branded right-hand auth panel: gradient, headline,
 * subtitle, an animated character illustration, tagline and dots. Fills its
 * container so it can be slid vertically by AuthSlide.
 */
export function WelcomePanel({
  title,
  subtitle,
  tagline,
  image,
}: {
  title: string;
  subtitle: string;
  tagline: string;
  image: string;
}) {
  return (
    <div
      className="relative flex h-full flex-col justify-center overflow-hidden px-12 py-16 text-cream"
      style={{
        background:
          "linear-gradient(150deg, var(--color-indigo) 0%, #16324a 45%, var(--color-bd-green) 100%)",
      }}
    >
      {/* decorative rings */}
      <div
        className="animate-spin-slow pointer-events-none absolute -top-24 -right-24 h-[28rem] w-[28rem] rounded-full border border-dashed border-cream/15"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-32 -left-20 h-96 w-96 rounded-full border border-dashed border-cream/10"
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col items-center text-center">
        <h2 className="max-w-md font-display text-4xl leading-tight font-semibold xl:text-5xl">
          {title}
        </h2>
        <p className="mt-4 max-w-sm text-sm leading-relaxed text-cream/80">
          {subtitle}
        </p>

        <div className="relative my-8 w-full max-w-md">
          <div
            className="animate-glow pointer-events-none absolute inset-8 rounded-full bg-cream/20 blur-2xl"
            aria-hidden="true"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt=""
            aria-hidden="true"
            className="relative w-full drop-shadow-2xl"
          />
        </div>

        <p className="max-w-xs text-sm font-medium text-cream/90">{tagline}</p>

        <div className="mt-8 flex items-center gap-2" aria-hidden="true">
          <span className="h-1.5 w-6 rounded-full bg-marigold" />
          <span className="h-1.5 w-1.5 rounded-full bg-cream/40" />
          <span className="h-1.5 w-1.5 rounded-full bg-cream/40" />
        </div>
      </div>
    </div>
  );
}
