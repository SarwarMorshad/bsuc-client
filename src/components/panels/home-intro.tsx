import { Link } from "@/i18n/navigation";
import { RunningStitch } from "@/components/motifs/running-stitch";

/** A short "about" teaser on the home page that links to the full About page. */
export function HomeIntro({
  eyebrow,
  title,
  lead,
  learnMore,
}: {
  eyebrow: string;
  title: string;
  lead: string;
  learnMore: string;
}) {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 px-6 text-center">
        <span className="text-xs font-medium tracking-[0.25em] text-brand-blue uppercase">
          {eyebrow}
        </span>
        <h2 className="font-display text-3xl font-semibold text-foreground sm:text-4xl">
          {title}
        </h2>
        <RunningStitch className="w-24 text-madder" />
        <p className="text-lg leading-relaxed text-foreground/80">{lead}</p>
        <Link
          href="/about"
          className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-indigo/40 px-6 py-2.5 text-sm font-medium text-indigo transition-colors hover:bg-indigo/5"
        >
          {learnMore}
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
