import { Link } from "@/i18n/navigation";
import { RunningStitch } from "@/components/motifs/running-stitch";
import { KanthaField } from "@/components/motifs/kantha-field";

export type Highlight = {
  href: string;
  title: string;
  text: string;
  image: string;
  fallbackColor: string;
};

/**
 * Discover — teaser cards on the home page, each linking to a full page.
 * Keeps the home a concise funnel instead of repeating full sections.
 */
export function Highlights({
  title,
  subtitle,
  cards,
  cta,
}: {
  title: string;
  subtitle: string;
  cards: Highlight[];
  cta: string;
}) {
  return (
    <section className="relative overflow-hidden py-20 sm:py-24">
      <KanthaField opacity={0.08} />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <h2 className="font-display text-3xl font-semibold text-foreground sm:text-4xl">
            {title}
          </h2>
          <RunningStitch className="w-24 text-madder" />
          <p className="max-w-xl text-muted-foreground">{subtitle}</p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {cards.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md"
            >
              <div
                className="h-44 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{
                  backgroundColor: c.fallbackColor,
                  backgroundImage: `url("${c.image}")`,
                }}
              />
              <div className="flex flex-1 flex-col gap-2 p-6">
                <h3 className="font-display text-xl font-semibold text-foreground">
                  {c.title}
                </h3>
                <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                  {c.text}
                </p>
                <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-brand-blue">
                  {cta}
                  <span
                    aria-hidden="true"
                    className="transition-transform group-hover:translate-x-1"
                  >
                    →
                  </span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
