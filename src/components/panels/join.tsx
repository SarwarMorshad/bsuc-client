import { RunningStitch } from "@/components/motifs/running-stitch";

/** Closing call to action — the finishing seam of the quilt. */
export function Join({
  title,
  body,
  cta,
}: {
  title: string;
  body: string;
  cta: string;
}) {
  return (
    <section
      id="join"
      className="bg-madder py-20 text-center text-cream sm:py-24"
    >
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-5 px-6">
        <RunningStitch className="w-20 text-marigold" />
        <h2 className="font-display text-3xl font-semibold sm:text-5xl">
          {title}
        </h2>
        <p className="text-cream/85">{body}</p>
        <a
          href="#join"
          className="mt-2 rounded-full bg-cream px-8 py-3 font-medium text-madder shadow-sm transition-transform hover:scale-[1.03]"
        >
          {cta}
        </a>
      </div>
    </section>
  );
}
