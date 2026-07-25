import { Link } from "@/i18n/navigation";
import { MotifIcon, type MotifName } from "@/components/motifs/motif-icon";

export type JobCategory = { label: string; icon: MotifName; accent: string };

/** Job Portal — a "coming soon" section listing the kinds of roles to expect. */
export function Jobs({
  note,
  categories,
  joinCta,
}: {
  note: string;
  categories: JobCategory[];
  joinCta: string;
}) {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <p className="mx-auto max-w-xl text-lg text-muted-foreground">{note}</p>

        <ul className="mt-10 grid gap-4 text-left sm:grid-cols-2">
          {categories.map((c) => (
            <li
              key={c.label}
              className="flex items-center gap-4 rounded-xl border border-dashed border-border bg-cream p-5"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-background ring-1 ring-border">
                <MotifIcon name={c.icon} className={`h-6 w-6 ${c.accent}`} />
              </span>
              <span className="text-sm font-medium text-foreground">
                {c.label}
              </span>
            </li>
          ))}
        </ul>

        <Link
          href="/join"
          className="mt-10 inline-block rounded-full bg-bd-green px-8 py-3 font-medium text-cream shadow-sm transition-transform hover:scale-[1.03]"
        >
          {joinCta}
        </Link>
      </div>
    </section>
  );
}
