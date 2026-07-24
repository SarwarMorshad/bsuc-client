import { RunningStitch } from "@/components/motifs/running-stitch";
import { KanthaField } from "@/components/motifs/kantha-field";
import { MotifIcon, type MotifName } from "@/components/motifs/motif-icon";

export type AboutPoint = {
  title: string;
  text: string;
  icon: MotifName;
  accent: string;
};

/**
 * About — a two-column introduction: who we are + three highlights beside a
 * framed community photo. The natural first section after the hero.
 */
export function About({
  eyebrow,
  title,
  lead,
  body,
  points,
  imageCaption,
}: {
  eyebrow: string;
  title: string;
  lead: string;
  body: string;
  points: AboutPoint[];
  imageCaption: string;
}) {
  return (
    <section
      id="about"
      className="relative overflow-hidden py-20 sm:py-28"
    >
      <KanthaField opacity={0.08} />

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 lg:grid-cols-2">
        {/* Text */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <span className="text-xs font-medium tracking-[0.25em] text-brand-blue uppercase">
              {eyebrow}
            </span>
            <h2 className="font-display text-3xl font-semibold text-foreground sm:text-5xl">
              {title}
            </h2>
            <RunningStitch className="w-24 text-madder" />
          </div>

          <p className="text-lg leading-relaxed text-foreground/85">{lead}</p>
          <p className="leading-relaxed text-muted-foreground">{body}</p>

          <ul className="mt-2 flex flex-col gap-5">
            {points.map((p) => (
              <li key={p.title} className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cream ring-1 ring-border">
                  <MotifIcon name={p.icon} className={`h-6 w-6 ${p.accent}`} />
                </span>
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    {p.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {p.text}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Framed photo */}
        <div className="relative mx-auto w-full max-w-md">
          <div
            className="aspect-[4/5] w-full rounded-2xl bg-cover bg-center shadow-lg ring-1 ring-border"
            style={{
              backgroundColor: "#006a4e",
              backgroundImage:
                'url("https://loremflickr.com/900/1100/bangladesh,students?lock=52"), url("/hero/slide-4.svg")',
            }}
            role="img"
            aria-label={imageCaption}
          />
          {/* stitched inner frame */}
          <div className="pointer-events-none absolute inset-3 rounded-xl border border-dashed border-cream/60" />
          {/* caption badge */}
          <div className="absolute -bottom-4 left-6 rounded-full bg-bd-green px-5 py-2 text-sm font-medium text-cream shadow-md">
            {imageCaption}
          </div>
          {/* corner motif */}
          <MotifIcon
            name="flower"
            className="absolute -top-4 -right-4 h-10 w-10 text-marigold drop-shadow"
          />
        </div>
      </div>
    </section>
  );
}
