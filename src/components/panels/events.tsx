import { KanthaField } from "@/components/motifs/kantha-field";
import { MotifIcon } from "@/components/motifs/motif-icon";
import { RunningStitch } from "@/components/motifs/running-stitch";
import { formatEventDate, type Event } from "@/lib/events";

/** Rotates through the thread colours so consecutive cards differ. */
const ACCENTS = ["text-bd-green", "text-madder", "text-indigo", "text-marigold"];

/** Events from the database, with an empty state when none are scheduled. */
export function Events({
  title,
  subtitle,
  emptyMessage,
  events,
  locale,
}: {
  title: string;
  subtitle: string;
  emptyMessage: string;
  events: Event[];
  locale: string;
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

        {events.length === 0 ? (
          <p className="mt-12 rounded-xl border border-dashed border-border bg-background/70 px-6 py-10 text-center text-muted-foreground">
            {emptyMessage}
          </p>
        ) : (
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((e, i) => (
              <article
                key={e.id}
                className="flex flex-col overflow-hidden rounded-lg border-2 border-dashed border-border bg-background shadow-sm"
              >
                {e.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={e.imageUrl}
                    alt=""
                    className="h-40 w-full object-cover"
                  />
                )}

                <div className="flex flex-1 flex-col gap-3 p-6">
                  <MotifIcon
                    name="flower"
                    className={`h-8 w-8 ${ACCENTS[i % ACCENTS.length]}`}
                  />
                  <h3 className="font-display text-xl font-semibold text-foreground">
                    {e.title}
                  </h3>

                  <dl className="text-sm text-muted-foreground">
                    <dt className="sr-only">Date</dt>
                    <dd className="font-medium text-foreground">
                      <time dateTime={e.date}>
                        {formatEventDate(e.date, locale)}
                      </time>
                    </dd>
                    {e.location && (
                      <>
                        <dt className="sr-only">Location</dt>
                        <dd className="mt-0.5">{e.location}</dd>
                      </>
                    )}
                  </dl>

                  {e.description && (
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {e.description}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
