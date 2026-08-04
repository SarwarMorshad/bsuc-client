import { CalendarDays, MapPin, Users } from "lucide-react";
import { KanthaField } from "@/components/motifs/kantha-field";
import { RunningStitch } from "@/components/motifs/running-stitch";
import { formatEventDate, type Event } from "@/lib/events";

/** Day and short month for the date chip, in the reader's language. */
function dateParts(iso: string, locale: string) {
  const d = new Date(iso);
  return {
    day: new Intl.DateTimeFormat(locale, { day: "numeric" }).format(d),
    month: new Intl.DateTimeFormat(locale, { month: "short" }).format(d),
    time: new Intl.DateTimeFormat(locale, {
      hour: "2-digit",
      minute: "2-digit",
    }).format(d),
  };
}

/** The square date block used across every card. */
function DateChip({
  iso,
  locale,
  large = false,
}: {
  iso: string;
  locale: string;
  large?: boolean;
}) {
  const { day, month } = dateParts(iso, locale);
  return (
    <div
      className={`flex shrink-0 flex-col items-center justify-center rounded-xl bg-bd-green text-cream ${
        large ? "h-20 w-20" : "h-14 w-14"
      }`}
    >
      <span
        className={`font-display leading-none font-semibold ${
          large ? "text-3xl" : "text-xl"
        }`}
      >
        {day}
      </span>
      <span
        className={`mt-0.5 uppercase ${large ? "text-xs" : "text-[0.625rem]"}`}
      >
        {month}
      </span>
    </div>
  );
}

/**
 * The public events listing: the next event featured, the rest in a grid, and
 * a quieter look back at past events.
 */
export function Events({
  title,
  subtitle,
  emptyMessage,
  labels,
  events,
  pastEvents = [],
  locale,
}: {
  title: string;
  subtitle: string;
  emptyMessage: string;
  labels: {
    nextUp: string;
    alsoComing: string;
    pastTitle: string;
    pastSubtitle: string;
    allWelcome: string;
  };
  events: Event[];
  pastEvents?: Event[];
  locale: string;
}) {
  const [featured, ...rest] = events;

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
          <p className="mt-12 rounded-2xl border border-dashed border-border bg-background/70 px-6 py-14 text-center text-muted-foreground">
            {emptyMessage}
          </p>
        ) : (
          <>
            {/* Featured: the very next thing happening. */}
            <article className="mt-12 grid overflow-hidden rounded-2xl border border-border bg-background shadow-sm md:grid-cols-2">
              <div className="relative min-h-56 bg-secondary md:min-h-full">
                {featured.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={featured.imageUrl}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <KanthaField opacity={0.5} />
                )}
                <span className="absolute top-4 left-4 rounded-full bg-madder px-3 py-1 text-xs font-medium tracking-wide text-cream uppercase">
                  {labels.nextUp}
                </span>
              </div>

              <div className="flex flex-col gap-4 p-6 sm:p-8">
                <div className="flex items-start gap-4">
                  <DateChip iso={featured.date} locale={locale} large />
                  <div className="min-w-0">
                    <h3 className="font-display text-2xl leading-tight font-semibold text-foreground sm:text-3xl">
                      {featured.title}
                    </h3>
                    <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                      <CalendarDays className="size-4 shrink-0" aria-hidden />
                      <time dateTime={featured.date}>
                        {formatEventDate(featured.date, locale)}
                      </time>
                    </p>
                    {featured.location && (
                      <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                        <MapPin className="size-4 shrink-0" aria-hidden />
                        {featured.location}
                      </p>
                    )}
                  </div>
                </div>

                {featured.description && (
                  <p className="leading-relaxed text-muted-foreground">
                    {featured.description}
                  </p>
                )}

                <p className="mt-auto flex items-center gap-1.5 pt-2 text-sm font-medium text-bd-green">
                  <Users className="size-4 shrink-0" aria-hidden />
                  {labels.allWelcome}
                </p>
              </div>
            </article>

            {rest.length > 0 && (
              <>
                <h3 className="mt-16 font-display text-2xl font-semibold text-foreground">
                  {labels.alsoComing}
                </h3>
                <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.map((e) => (
                    <EventCard key={e.id} event={e} locale={locale} />
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {pastEvents.length > 0 && (
          <div className="mt-20 border-t border-border pt-12">
            <div className="flex flex-col gap-2">
              <h3 className="font-display text-2xl font-semibold text-foreground">
                {labels.pastTitle}
              </h3>
              <p className="text-muted-foreground">{labels.pastSubtitle}</p>
            </div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {pastEvents.map((e) => (
                <EventCard key={e.id} event={e} locale={locale} past />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function EventCard({
  event: e,
  locale,
  past = false,
}: {
  event: Event;
  locale: string;
  past?: boolean;
}) {
  return (
    <article
      className={`group flex flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-sm transition-shadow hover:shadow-md ${
        past ? "opacity-80 grayscale-[0.3] hover:opacity-100" : ""
      }`}
    >
      <div className="relative h-40 shrink-0 bg-secondary">
        {e.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={e.imageUrl}
            alt=""
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <KanthaField opacity={0.5} />
        )}
        <div className="absolute right-4 -bottom-6">
          <DateChip iso={e.date} locale={locale} />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-6 pt-8">
        <h4 className="font-display text-lg leading-tight font-semibold text-foreground">
          {e.title}
        </h4>
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <CalendarDays className="size-3.5 shrink-0" aria-hidden />
          <time dateTime={e.date}>{formatEventDate(e.date, locale)}</time>
        </p>
        {e.location && (
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="size-3.5 shrink-0" aria-hidden />
            {e.location}
          </p>
        )}
        {e.description && (
          <p className="mt-1 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {e.description}
          </p>
        )}
      </div>
    </article>
  );
}
