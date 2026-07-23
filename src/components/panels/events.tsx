import { KanthaField } from "@/components/motifs/kantha-field";
import { MotifIcon } from "@/components/motifs/motif-icon";
import { RunningStitch } from "@/components/motifs/running-stitch";

export type EventItem = {
  title: string;
  date: string;
  place: string;
  accent: string;
};

/** Cream panel with embroidered field and stitched event cards. */
export function Events({
  title,
  subtitle,
  items,
  cta,
}: {
  title: string;
  subtitle: string;
  items: EventItem[];
  cta: string;
}) {
  return (
    <section id="events" className="relative overflow-hidden py-20 sm:py-24">
      <KanthaField opacity={0.35} />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <RunningStitch className="w-20 text-madder" />
          <h2 className="font-display text-3xl font-semibold text-foreground sm:text-5xl">
            {title}
          </h2>
          <p className="max-w-xl text-muted-foreground">{subtitle}</p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          {items.map((e) => (
            <article
              key={e.title}
              className="flex flex-col gap-3 rounded-lg border-2 border-dashed border-border bg-background p-6 shadow-sm"
            >
              <MotifIcon name="flower" className={`h-8 w-8 ${e.accent}`} />
              <h3 className="font-display text-xl font-semibold text-foreground">
                {e.title}
              </h3>
              <dl className="text-sm text-muted-foreground">
                <div className="flex gap-2">
                  <dt className="font-medium text-foreground">{e.date}</dt>
                  <dd>· {e.place}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <span className="rounded-full border border-dashed border-primary px-6 py-2.5 text-sm font-medium text-primary">
            {cta}
          </span>
        </div>
      </div>
    </section>
  );
}
