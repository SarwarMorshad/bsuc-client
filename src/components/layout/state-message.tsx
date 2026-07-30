import { RunningStitch } from "@/components/motifs/running-stitch";
import { KanthaField } from "@/components/motifs/kantha-field";

/**
 * StateMessage — the shared centred layout for full-page states
 * (404, error). Keeps the kantha styling consistent with the rest of the site.
 */
export function StateMessage({
  code,
  title,
  body,
  children,
}: {
  code?: string;
  title: string;
  body: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden px-6 py-20">
      <KanthaField opacity={0.1} />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 50% 45%, var(--color-cream) 40%, color-mix(in srgb, var(--color-cream) 65%, transparent) 72%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      <div className="relative flex max-w-md flex-col items-center gap-5 text-center">
        {code && (
          <span className="font-display text-6xl font-semibold text-madder/70">
            {code}
          </span>
        )}
        <h1 className="font-display text-3xl font-semibold text-foreground sm:text-4xl">
          {title}
        </h1>
        <RunningStitch className="w-24 text-madder" />
        <p className="leading-relaxed text-muted-foreground">{body}</p>
        {children && (
          <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
