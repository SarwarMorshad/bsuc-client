"use client";

import { useCallback, useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  CalendarDays,
  ExternalLink,
  ImageIcon,
  Loader2,
  MapPin,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toApiError } from "@/lib/api";
import { deleteEvent, listAllEvents, updateEvent } from "@/lib/admin-events";
import { formatEventDate, type Event } from "@/lib/events";
import { EventFormDialog } from "@/components/admin/event-form";

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
  const [formOpen, setFormOpen] = useState(false);
  const [confirming, setConfirming] = useState<Event | null>(null);
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

  async function confirmDelete() {
    const event = confirming;
    if (!event) return;
    setBusyId(event.id);
    setNotice(null);
    try {
      await deleteEvent(event.id);
      setConfirming(null);
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
      <p
        role="status"
        aria-live="polite"
        className="flex items-center gap-2 text-muted-foreground"
      >
        <Loader2 className="size-4 animate-spin" aria-hidden />
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

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(e: Event) {
    setEditing(e);
    setFormOpen(true);
  }

  const row = (e: Event, isLive = false) => (
    <EventCard
      key={e.id}
      event={e}
      live={isLive}
      past={isPast(e)}
      locale={locale}
      busy={busyId === e.id}
      onTogglePublished={() => togglePublished(e)}
      onEdit={() => openEdit(e)}
      onDelete={() => setConfirming(e)}
    />
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Summary strip — the three numbers an admin actually cares about. */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4">
        <dl className="flex flex-wrap items-center gap-6">
          <Stat label={t("liveNow")} value={live.length} accent />
          <Stat label={t("draftsSection")} value={drafts.length} />
          <Stat label={t("pastSection")} value={past.length} />
        </dl>
        <Button onClick={openCreate}>
          <Plus aria-hidden />
          {t("newEvent")}
        </Button>
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {error}
        </p>
      )}
      {notice && (
        <p
          aria-live="polite"
          className="rounded-lg bg-primary/10 px-4 py-3 text-sm text-foreground"
        >
          {notice}
        </p>
      )}

      {events.length === 0 ? (
        <EmptyState
          title={t("noEvents")}
          action={
            <Button onClick={openCreate}>
              <Plus aria-hidden />
              {t("newEvent")}
            </Button>
          }
        />
      ) : (
        <div className="flex flex-col gap-10">
          <Section
            title={t("liveNow")}
            hint={t("liveNowHint")}
            count={live.length}
            accent
          >
            {live.length === 0 ? (
              <EmptyState title={t("noLive")} />
            ) : (
              <ul className="grid gap-4">{live.map((e) => row(e, true))}</ul>
            )}
          </Section>

          {drafts.length > 0 && (
            <Section
              title={t("draftsSection")}
              hint={t("draftsHint")}
              count={drafts.length}
            >
              <ul className="grid gap-4">{drafts.map((e) => row(e))}</ul>
            </Section>
          )}

          {past.length > 0 && (
            <Section
              title={t("pastSection")}
              hint={t("pastHint")}
              count={past.length}
            >
              <ul className="grid gap-4">{past.map((e) => row(e))}</ul>
            </Section>
          )}
        </div>
      )}

      {/* Kept mounted so opening it is a real transition — see EventFormDialog. */}
      <EventFormDialog
        event={editing ?? undefined}
        open={formOpen}
        onOpenChange={setFormOpen}
        onSaved={() => {
          setFormOpen(false);
          setNotice(t("saved"));
          void load();
        }}
      />

      <Dialog
        open={confirming !== null}
        onOpenChange={(o) => !o && setConfirming(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display text-lg">
              {t("deleteEvent")}
            </DialogTitle>
            <DialogDescription>
              {t("confirmDeleteNamed", { title: confirming?.title ?? "" })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirming(null)}
              disabled={busyId !== null}
            >
              {t("cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={busyId !== null}
            >
              {busyId !== null && (
                <Loader2 className="animate-spin" aria-hidden />
              )}
              {t("deleteEvent")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Stat({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      {accent && (
        <span aria-hidden className="size-2 shrink-0 rounded-full bg-primary" />
      )}
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="font-display text-lg font-semibold text-foreground">
        {value}
      </dd>
    </div>
  );
}

function Section({
  title,
  hint,
  count,
  accent = false,
  children,
}: {
  title: string;
  hint: string;
  count: number;
  accent?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          {accent && (
            <span
              aria-hidden
              className="size-2 shrink-0 rounded-full bg-primary"
            />
          )}
          <h2 className="font-display text-lg font-semibold text-foreground">
            {title}
          </h2>
          <Badge variant="secondary">{count}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">{hint}</p>
      </div>
      {children}
    </section>
  );
}

function EmptyState({
  title,
  action,
}: {
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border px-6 py-12 text-center">
      <CalendarDays className="size-6 text-muted-foreground" aria-hidden />
      <p className="text-sm text-muted-foreground">{title}</p>
      {action}
    </div>
  );
}

/** One event card. Shared by all three groups so the actions stay identical. */
function EventCard({
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
      className={`group flex flex-col overflow-hidden rounded-2xl border bg-card transition-shadow hover:shadow-sm sm:flex-row ${
        isLive ? "border-primary/40" : "border-border"
      } ${isPast ? "opacity-75" : ""}`}
    >
      <div className="relative aspect-video shrink-0 bg-muted sm:aspect-auto sm:w-48">
        {e.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={e.imageUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="absolute inset-0 grid place-items-center text-muted-foreground">
            <ImageIcon className="size-6" aria-hidden />
          </span>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-3 p-4">
        <div className="flex min-w-0 flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={e.published ? "default" : "secondary"}>
              {e.published ? t("published") : t("draft")}
            </Badge>
            {isPast && <Badge variant="outline">{t("past")}</Badge>}
          </div>
          <h3 className="font-display text-lg leading-tight font-semibold text-foreground">
            {e.title}
          </h3>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CalendarDays className="size-3.5 shrink-0" aria-hidden />
              <time dateTime={e.date}>{formatEventDate(e.date, locale)}</time>
            </span>
            {e.location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="size-3.5 shrink-0" aria-hidden />
                {e.location}
              </span>
            )}
          </div>
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onTogglePublished}
            disabled={busy}
          >
            {busy && <Loader2 className="animate-spin" aria-hidden />}
            {e.published ? t("unpublish") : t("publish")}
          </Button>
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Pencil aria-hidden />
            {t("edit")}
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={onDelete}
            disabled={busy}
          >
            <Trash2 aria-hidden />
            {t("deleteEvent")}
          </Button>
          {isLive && (
            <a
              href={`/${locale === "en" ? "" : `${locale}/`}events`}
              target="_blank"
              rel="noreferrer"
              className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              {t("viewOnSite")}
              <ExternalLink className="size-3" aria-hidden />
            </a>
          )}
        </div>
      </div>
    </li>
  );
}
