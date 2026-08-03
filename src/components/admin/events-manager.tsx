"use client";

import { useCallback, useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { toApiError } from "@/lib/api";
import {
  deleteEvent,
  listAllEvents,
  updateEvent,
} from "@/lib/admin-events";
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

  const load = useCallback(async () => {
    try {
      setEvents(await listAllEvents());
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

  const now = Date.now();

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
        <p role="alert" className="rounded-lg bg-madder/10 px-4 py-3 text-sm text-madder">
          {error}
        </p>
      )}
      {notice && (
        <p aria-live="polite" className="rounded-lg bg-bd-green/15 px-4 py-3 text-sm text-foreground">
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
        <ul className="flex flex-col gap-3">
          {events.map((e) => {
            const isPast = new Date(e.date).getTime() < now;
            return (
              <li
                key={e.id}
                className="flex flex-col gap-3 rounded-xl border border-border bg-background p-4 sm:flex-row sm:items-center sm:justify-between"
              >
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

                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={() => togglePublished(e)}
                    disabled={busyId === e.id}
                    className="rounded-full border border-border px-4 py-1.5 text-xs font-medium text-foreground hover:bg-muted/30 disabled:opacity-60"
                  >
                    {e.published ? t("unpublish") : t("publish")}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCreating(false);
                      setEditing(e);
                    }}
                    className="rounded-full border border-indigo/40 px-4 py-1.5 text-xs font-medium text-indigo hover:bg-indigo/5"
                  >
                    {t("edit")}
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(e)}
                    disabled={busyId === e.id}
                    className="rounded-full border border-madder/40 px-4 py-1.5 text-xs font-medium text-madder hover:bg-madder/5 disabled:opacity-60"
                  >
                    {t("deleteEvent")}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
