import { RunningStitch } from "@/components/motifs/running-stitch";
import { ClothTexture } from "@/components/motifs/cloth-texture";
import { KanthaField } from "@/components/motifs/kantha-field";
import { KanthaFrame } from "@/components/motifs/kantha-frame";

/**
 * Intro — the second panel. A brief framing of the journey (home → Chemnitz),
 * on the same framed cloth field. Placeholder for the fuller storyboard panels.
 */
export function Intro({ title, body }: { title: string; body: string }) {
  return (
    <section
      id="about"
      className="relative flex min-h-[70vh] flex-col items-center justify-center gap-6 overflow-hidden px-8 py-24 text-center"
    >
      <ClothTexture />
      <KanthaField />
      <KanthaFrame />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 46% 44% at 50% 50%, var(--color-cream) 25%, color-mix(in srgb, var(--color-cream) 55%, transparent) 58%, transparent 78%)",
        }}
        aria-hidden="true"
      />

      <RunningStitch className="relative w-24 text-indigo" />
      <h2 className="relative max-w-2xl font-display text-3xl font-semibold text-foreground sm:text-5xl">
        {title}
      </h2>
      <p className="relative max-w-xl text-lg leading-relaxed text-muted-foreground">
        {body}
      </p>
      <RunningStitch className="w-24 text-bd-green" delayMs={300} />
    </section>
  );
}
