"use client";

import { useCallback, useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { toApiError } from "@/lib/api";
import { deleteEvent, listAllEvents, updateEvent } from "@/lib/admin-events";
import { formatEventDate, type Event } from "@/lib/events";
import { EventForm } from "@/components/admin/event-form";

/** Lists every event with publish, edit and delete actions. */
export function EventsManager() {
  const t = useTranslations("admin");
  const s = useTranslations("states");
  const locale = useLocale();

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [editing, setEditing] = useState<Event | null>(null);
  const [creating, setCreating] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  // Captured on load rather than during render, so "past" is a stable value and
  // the render stays pure.
  const [now, setNow] = useState(0);

  const load = useCallback(async () => {
    try {
      setEvents(await listAllEvents());
      setNow(Date.now());
      setError(null);
    } catch (err) {
      setError(toApiError(err).error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function togglePublished(event: Event) {
    setBusyId(event.id);
    setNotice(null);
    try {
      await updateEvent(event.id, { published: !event.published });
      await load();
      setNotice(t("saved"));
    } catch (err) {
      setError(toApiError(err).error);
    } finally {
      setBusyId(null);
    }
  }

  async function remove(event: Event) {
    if (!window.confirm(t("confirmDelete"))) return;
    setBusyId(event.id);
    setNotice(null);
    try {
      await deleteEvent(event.id);
      await load();
      setNotice(t("deleted"));
    } catch (err) {
      setError(toApiError(err).error);
    } finally {
      setBusyId(null);
    }
  }

  if (loading) {
    return (
      <p role="status" aria-live="polite" className="text-muted-foreground">
        {s("loading")}
      </p>
    );
  }

  const isPast = (e: Event) => new Date(e.date).getTime() < now;

  // "Live" means exactly what a visitor sees on the public events page:
  // published and not yet over.
  const live = events.filter((e) => e.published && !isPast(e));
  const drafts = events.filter((e) => !e.published);
  const past = events.filter((e) => e.published && isPast(e));

  const row = (e: Event, isLive = false) => (
    <EventRow
      key={e.id}
      event={e}
      live={isLive}
      past={isPast(e)}
      locale={locale}
      busy={busyId === e.id}
      onTogglePublished={() => togglePublished(e)}
      onEdit={() => {
        setCreating(false);
        setEditing(e);
      }}
      onDelete={() => remove(e)}
    />
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {t("eventCount", { count: events.length })}
        </p>
        {!creating && !editing && (
          <button
            type="button"
            onClick={() => setCreating(true)}
            className="rounded-full bg-bd-green px-5 py-2 text-sm font-medium text-cream"
          >
            {t("newEvent")}
          </button>
        )}
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-lg bg-madder/10 px-4 py-3 text-sm text-madder"
        >
          {error}
        </p>
      )}
      {notice && (
        <p
          aria-live="polite"
          className="rounded-lg bg-bd-green/15 px-4 py-3 text-sm text-foreground"
        >
          {notice}
        </p>
      )}

      {(creating || editing) && (
        <EventForm
          event={editing ?? undefined}
          onDone={() => {
            setCreating(false);
            setEditing(null);
            setNotice(t("saved"));
            void load();
          }}
          onCancel={() => {
            setCreating(false);
            setEditing(null);
          }}
        />
      )}

      {events.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border px-6 py-10 text-center text-muted-foreground">
          {t("noEvents")}
        </p>
      ) : (
        <div className="flex flex-col gap-8">
          {/* What visitors actually see right now, first. */}
          <section className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span
                aria-hidden
                className="h-2 w-2 shrink-0 rounded-full bg-bd-green"
              />
              <h2 className="font-display text-lg font-semibold text-foreground">
                {t("liveNow")}
              </h2>
              <span className="rounded-full bg-bd-green/15 px-2 py-0.5 text-xs font-medium text-bd-green">
                {live.length}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{t("liveNowHint")}</p>
            {live.length === 0 ? (
              <p className="rounded-xl border border-dashed border-border px-6 py-8 text-center text-sm text-muted-foreground">
                {t("noLive")}
              </p>
            ) : (
              <ul className="flex flex-col gap-3">
                {live.map((e) => row(e, true))}
              </ul>
            )}
          </section>

          {drafts.length > 0 && (
            <section className="flex flex-col gap-3">
              <h2 className="font-display text-lg font-semibold text-foreground">
                {t("draftsSection")}{" "}
                <span className="text-sm font-normal text-muted-foreground">
                  ({drafts.length})
                </span>
              </h2>
              <p className="text-sm text-muted-foreground">{t("draftsHint")}</p>
              <ul className="flex flex-col gap-3">
                {drafts.map((e) => row(e))}
              </ul>
            </section>
          )}

          {past.length > 0 && (
            <section className="flex flex-col gap-3">
              <h2 className="font-display text-lg font-semibold text-foreground">
                {t("pastSection")}{" "}
                <span className="text-sm font-normal text-muted-foreground">
                  ({past.length})
                </span>
              </h2>
              <p className="text-sm text-muted-foreground">{t("pastHint")}</p>
              <ul className="flex flex-col gap-3">{past.map((e) => row(e))}</ul>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

/** One event row. Shared by all three groups so the actions stay identical. */
function EventRow({
  event: e,
  live: isLive,
  past: isPast,
  locale,
  busy,
  onTogglePublished,
  onEdit,
  onDelete,
}: {
  event: Event;
  live: boolean;
  past: boolean;
  locale: string;
  busy: boolean;
  onTogglePublished: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const t = useTranslations("admin");

  return (
    <li
      className={`flex flex-col gap-3 rounded-xl border bg-background p-4 sm:flex-row sm:items-center sm:justify-between ${
        isLive ? "border-bd-green/40" : "border-border"
      }`}
    >
      <div className="flex min-w-0 items-center gap-4">
        {e.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={e.imageUrl}
            alt=""
            className="hidden h-14 w-24 shrink-0 rounded-lg object-cover sm:block"
          />
        )}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-display text-lg font-semibold text-foreground">
              {e.title}
            </h3>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                e.published
                  ? "bg-bd-green/15 text-bd-green"
                  : "bg-marigold/20 text-ink"
              }`}
            >
              {e.published ? t("published") : t("draft")}
            </span>
            {isPast && (
              <span className="rounded-full bg-muted/40 px-2.5 py-0.5 text-xs text-muted-foreground">
                {t("past")}
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            <time dateTime={e.date}>{formatEventDate(e.date, locale)}</time>
            {e.location && ` · ${e.location}`}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-2">
        {isLive && (
          <a
            href={`/${locale === "en" ? "" : `${locale}/`}events`}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-border px-4 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            {t("viewOnSite")}
          </a>
        )}
        <button
          type="button"
          onClick={onTogglePublished}
          disabled={busy}
          className="rounded-full border border-border px-4 py-1.5 text-xs font-medium text-foreground hover:bg-muted/30 disabled:opacity-60"
        >
          {e.published ? t("unpublish") : t("publish")}
        </button>
        <button
          type="button"
          onClick={onEdit}
          className="rounded-full border border-indigo/40 px-4 py-1.5 text-xs font-medium text-indigo hover:bg-indigo/5"
        >
          {t("edit")}
        </button>
        <button
          type="button"
          onClick={onDelete}
          disabled={busy}
          className="rounded-full border border-madder/40 px-4 py-1.5 text-xs font-medium text-madder hover:bg-madder/5 disabled:opacity-60"
        >
          {t("deleteEvent")}
        </button>
      </div>
    </li>
  );
}
