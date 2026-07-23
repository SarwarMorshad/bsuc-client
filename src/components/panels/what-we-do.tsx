import { MotifIcon, type MotifName } from "@/components/motifs/motif-icon";
import { RunningStitch } from "@/components/motifs/running-stitch";

export type DoingItem = {
  title: string;
  body: string;
  icon: MotifName;
  accent: string;
};

/** Deep-green panel with cream cards — the strongest colour block on the page. */
export function WhatWeDo({
  title,
  subtitle,
  items,
}: {
  title: string;
  subtitle: string;
  items: DoingItem[];
}) {
  return (
    <section id="doing" className="bg-bd-green py-20 text-cream sm:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <RunningStitch className="w-20 text-marigold" />
          <h2 className="font-display text-3xl font-semibold sm:text-5xl">
            {title}
          </h2>
          <p className="max-w-xl text-cream/80">{subtitle}</p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <article
              key={item.title}
              className="flex flex-col items-start gap-3 rounded-lg border border-dashed border-cream/40 bg-cream p-6 text-foreground shadow-sm"
            >
              <MotifIcon
                name={item.icon}
                className={`h-9 w-9 ${item.accent}`}
              />
              <h3 className="font-display text-xl font-semibold">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {item.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
