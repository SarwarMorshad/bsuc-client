/**
 * AuthShell — split-screen auth layout: a form column and a branded welcome
 * panel with an animated character illustration (hidden on small screens).
 *
 * `reverse` swaps the sides: login keeps the form on the left, join puts it on
 * the right. Both columns slide in from their side, giving a "swap" feel when
 * navigating between /login and /join.
 */
export function AuthShell({
  title,
  subtitle,
  tagline,
  image,
  reverse = false,
  children,
}: {
  title: string;
  subtitle: string;
  tagline: string;
  image: string;
  reverse?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className="grid min-h-[86vh] lg:grid-cols-2">
      {/* Form column */}
      <div
        className={`flex items-center justify-center px-6 py-14 sm:px-10 ${
          reverse ? "lg:order-2" : "lg:order-1"
        }`}
      >
        <div className="w-full max-w-sm">{children}</div>
      </div>

      {/* Illustration / welcome column */}
      <div
        className={`relative hidden flex-col justify-center overflow-hidden px-12 py-16 text-cream lg:flex ${
          reverse ? "lg:order-1" : "lg:order-2"
        }`}
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

          {/* Animated character illustration */}
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
    </section>
  );
}
