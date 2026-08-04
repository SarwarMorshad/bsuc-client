"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { inputClass } from "@/components/forms/form-ui";
import { toApiError } from "@/lib/api";
import {
  createEvent,
  updateEvent,
  uploadEventImage,
  type EventInput,
} from "@/lib/admin-events";
import type { Event } from "@/lib/events";

/** ISO timestamp -> value for <input type="datetime-local"> in local time. */
function toLocalInput(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** Create or edit an event. Passing `event` switches the form to edit mode. */
export function EventForm({
  event,
  onDone,
  onCancel,
}: {
  event?: Event;
  onDone: () => void;
  onCancel: () => void;
}) {
  const t = useTranslations("admin");
  const f = useTranslations("form");

  const [values, setValues] = useState({
    title: event?.title ?? "",
    date: event ? toLocalInput(event.date) : "",
    location: event?.location ?? "",
    description: event?.description ?? "",
    imageUrl: event?.imageUrl ?? "",
    imagePublicId: event?.imagePublicId ?? "",
    published: event?.published ?? false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const set =
    (key: keyof typeof values) => (e: { target: { value: string } }) => {
      setValues((v) => ({ ...v, [key]: e.target.value }));
      if (errors[key]) setErrors((p) => ({ ...p, [key]: "" }));
    };

  /**
   * Uploads immediately on pick so the admin sees the real Cloudinary image
   * before saving, rather than a local preview that might fail later.
   */
  async function pickPhoto(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    // Reset so re-picking the same file fires change again.
    e.target.value = "";
    if (!file) return;

    setErrors((p) => ({ ...p, imageUrl: "" }));
    setUploading(true);
    try {
      const { imageUrl, imagePublicId } = await uploadEventImage(file);
      setValues((v) => ({ ...v, imageUrl, imagePublicId }));
    } catch (err) {
      setErrors((p) => ({ ...p, imageUrl: toApiError(err).error }));
    } finally {
      setUploading(false);
    }
  }

  function removePhoto() {
    // The old file is cleaned up server-side once the change is saved.
    setValues((v) => ({ ...v, imageUrl: "", imagePublicId: "" }));
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);

    const next: Record<string, string> = {};
    if (!values.title.trim()) next.title = f("required");
    if (!values.date) next.date = f("required");
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const payload: EventInput = {
      title: values.title,
      // datetime-local has no timezone; treat it as the admin's local time.
      date: new Date(values.date).toISOString(),
      location: values.location || null,
      description: values.description || null,
      imageUrl: values.imageUrl || null,
      imagePublicId: values.imagePublicId || null,
      published: values.published,
    };

    setSaving(true);
    try {
      if (event) await updateEvent(event.id, payload);
      else await createEvent(payload);
      onDone();
    } catch (err) {
      const apiError = toApiError(err);
      if (apiError.fields) setErrors(apiError.fields);
      else setFormError(apiError.error);
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      noValidate
      className="flex flex-col gap-4 rounded-2xl border border-border bg-cream p-6"
    >
      <h2 className="font-display text-xl font-semibold text-foreground">
        {event ? t("editEvent") : t("newEvent")}
      </h2>

      {formError && (
        <p
          role="alert"
          className="rounded-lg bg-madder/10 px-4 py-3 text-sm text-madder"
        >
          {formError}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label
            htmlFor="ev-title"
            className="text-sm font-medium text-foreground"
          >
            {t("eventTitle")}
          </label>
          <input
            id="ev-title"
            value={values.title}
            onChange={set("title")}
            aria-invalid={!!errors.title}
            className={inputClass(!!errors.title)}
          />
          {errors.title && (
            <span role="alert" className="text-xs text-madder">
              {errors.title}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="ev-date"
            className="text-sm font-medium text-foreground"
          >
            {t("eventDate")}
          </label>
          <input
            id="ev-date"
            type="datetime-local"
            value={values.date}
            onChange={set("date")}
            aria-invalid={!!errors.date}
            className={inputClass(!!errors.date)}
          />
          {errors.date && (
            <span role="alert" className="text-xs text-madder">
              {errors.date}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="ev-location"
            className="text-sm font-medium text-foreground"
          >
            {t("eventLocation")}
          </label>
          <input
            id="ev-location"
            value={values.location}
            onChange={set("location")}
            className={inputClass(!!errors.location)}
          />
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label
            htmlFor="ev-description"
            className="text-sm font-medium text-foreground"
          >
            {t("eventDescription")}
          </label>
          <textarea
            id="ev-description"
            rows={4}
            value={values.description}
            onChange={set("description")}
            className={`${inputClass(!!errors.description)} resize-y`}
          />
        </div>

        <div className="flex flex-col gap-2 sm:col-span-2">
          <span className="text-sm font-medium text-foreground">
            {t("eventPhoto")}
          </span>

          <div className="flex flex-wrap items-center gap-4">
            <div className="relative aspect-video w-48 shrink-0 overflow-hidden rounded-xl border border-border bg-secondary">
              {values.imageUrl ? (
                // Cloudinary host is not in next.config images; a plain img keeps
                // this admin-only preview simple.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={values.imageUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="absolute inset-0 grid place-items-center text-xs text-muted-foreground">
                  {t("eventPhoto")}
                </span>
              )}
              {uploading && (
                <span className="absolute inset-0 grid place-items-center bg-foreground/50 text-xs font-medium text-cream">
                  {t("uploadingPhoto")}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <input
                ref={fileRef}
                id="ev-photo"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={pickPhoto}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary disabled:opacity-60"
              >
                {values.imageUrl ? t("changePhoto") : t("uploadPhoto")}
              </button>
              {values.imageUrl && !uploading && (
                <button
                  type="button"
                  onClick={removePhoto}
                  className="text-xs text-madder hover:underline"
                >
                  {t("removePhoto")}
                </button>
              )}
            </div>
          </div>

          <p className="text-xs text-muted-foreground">{t("photoHint")}</p>
          {errors.imageUrl && (
            <span role="alert" className="text-xs text-madder">
              {errors.imageUrl}
            </span>
          )}
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-foreground">
        <input
          type="checkbox"
          checked={values.published}
          onChange={(e) =>
            setValues((v) => ({ ...v, published: e.target.checked }))
          }
          className="h-4 w-4 rounded border-border accent-bd-green"
        />
        {t("published")}
      </label>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving || uploading}
          className="rounded-full bg-bd-green px-6 py-2.5 text-sm font-medium text-cream disabled:opacity-60"
        >
          {saving ? f("submitting") : event ? t("save") : t("create")}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          {t("cancel")}
        </button>
      </div>
    </form>
  );
}
