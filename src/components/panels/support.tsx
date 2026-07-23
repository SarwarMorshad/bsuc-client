import { MotifIcon } from "@/components/motifs/motif-icon";
import { RunningStitch } from "@/components/motifs/running-stitch";

/** Indigo panel — the practical "first week survival kit" checklist. */
export function Support({
  title,
  subtitle,
  items,
}: {
  title: string;
  subtitle: string;
  items: string[];
}) {
  return (
    <section id="support" className="bg-indigo py-20 text-cream sm:py-24">
      <div className="mx-auto max-w-4xl px-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <RunningStitch className="w-20 text-marigold" />
          <h2 className="font-display text-3xl font-semibold sm:text-5xl">
            {title}
          </h2>
          <p className="text-cream/80">{subtitle}</p>
        </div>

        <ol className="mt-12 grid gap-4 sm:grid-cols-2">
          {items.map((item, i) => (
            <li
              key={item}
              className="flex items-center gap-4 rounded-lg border border-dashed border-cream/35 bg-cream/10 px-5 py-4"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-marigold font-display text-sm font-semibold text-ink">
                {i + 1}
              </span>
              <span className="text-sm text-cream/95">{item}</span>
              <MotifIcon
                name="star"
                className="ml-auto h-5 w-5 shrink-0 text-marigold/70"
              />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
