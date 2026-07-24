import { RunningStitch } from "@/components/motifs/running-stitch";
import { KanthaField } from "@/components/motifs/kantha-field";

/** A compact header band for interior pages: title + subtitle on a kantha field. */
export function PageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <section className="relative overflow-hidden border-b border-border py-16 text-center sm:py-20">
      <KanthaField opacity={0.12} />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 90% at 50% 40%, var(--color-cream) 40%, color-mix(in srgb, var(--color-cream) 60%, transparent) 75%, transparent 100%)",
        }}
        aria-hidden="true"
      />
      <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-4 px-6">
        <h1 className="font-display text-4xl font-semibold text-foreground sm:text-5xl">
          {title}
        </h1>
        <RunningStitch className="w-24 text-madder" />
        <p className="text-lg text-muted-foreground">{subtitle}</p>
      </div>
    </section>
  );
}
