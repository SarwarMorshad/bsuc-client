"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { ImageIcon, Loader2, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { inputClass } from "@/components/forms/form-ui";
import { toApiError } from "@/lib/api";
import {
  createEvent,
  discardEventImage,
  updateEvent,
  uploadEventImage,
  type EventInput,
} from "@/lib/admin-events";
import type { Event } from "@/lib/events";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

/** ISO timestamp -> value for <input type="datetime-local"> in local time. */
function toLocalInput(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** Fields the form edits, seeded from an existing event when editing. */
function initialValues(event?: Event) {
  return {
    title: event?.title ?? "",
    date: event ? toLocalInput(event.date) : "",
    location: event?.location ?? "",
    description: event?.description ?? "",
    imageUrl: event?.imageUrl ?? "",
    imagePublicId: event?.imagePublicId ?? "",
    published: event?.published ?? false,
  };
}

/**
 * Create or edit an event in a modal. Passing `event` switches to edit mode.
 *
 * Stays mounted while closed so Base UI sees a real closed -> open transition
 * and moves focus into the dialog; the fields reset on each opening instead.
 */
export function EventFormDialog({
  event,
  open,
  onOpenChange,
  onSaved,
}: {
  event?: Event;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
}) {
  const t = useTranslations("admin");
  const f = useTranslations("form");

  const [values, setValues] = useState(() => initialValues(event));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  // The chosen file is held locally and only sent to Cloudinary on save, so
  // cancelling leaves nothing behind.
  const [photo, setPhoto] = useState<{ file: File; preview: string } | null>(
    null,
  );
  const fileRef = useRef<HTMLInputElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  // Set when an upload succeeded but saving then failed: reused on retry so a
  // second attempt does not orphan a second copy, and cleaned up on cancel.
  const strandedUpload = useRef<{ url: string; publicId: string } | null>(null);

  function releasePhoto(next: { file: File; preview: string } | null) {
    setPhoto((prev) => {
      if (prev) URL.revokeObjectURL(prev.preview);
      return next;
    });
  }

  /** Deletes an upload that never made it onto an event. Best effort. */
  function discardStranded() {
    const stranded = strandedUpload.current;
    strandedUpload.current = null;
    if (stranded) void discardEventImage(stranded.publicId).catch(() => {});
  }

  // Reset each time the dialog opens, so a cancelled edit does not leak into
  // the next one. Adjusting state during render is React's documented
  // alternative to doing this in an effect.
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setValues(initialValues(event));
      setErrors({});
      setFormError(null);
      setSaving(false);
      setUploading(false);
      releasePhoto(null);
    } else {
      // Closed without saving — drop anything already sent to Cloudinary.
      discardStranded();
      releasePhoto(null);
    }
  }

  const set =
    (key: keyof typeof values) => (e: { target: { value: string } }) => {
      setValues((v) => ({ ...v, [key]: e.target.value }));
      if (errors[key]) setErrors((p) => ({ ...p, [key]: "" }));
    };

  /**
   * Shows a local preview only. The file is uploaded when the admin saves, so
   * cancelling never leaves an orphan in Cloudinary.
   */
  function pickPhoto(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    // Reset so re-picking the same file fires change again.
    e.target.value = "";
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setErrors((p) => ({ ...p, imageUrl: t("photoTypeError") }));
      return;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      setErrors((p) => ({ ...p, imageUrl: t("photoSizeError") }));
      return;
    }

    setErrors((p) => ({ ...p, imageUrl: "" }));
    releasePhoto({ file, preview: URL.createObjectURL(file) });
  }

  function removePhoto() {
    releasePhoto(null);
    // The previous file is cleaned up server-side once the change is saved.
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

    setSaving(true);

    // Upload now, not on pick — reusing an earlier upload if a previous save
    // attempt failed after it went through.
    let image = strandedUpload.current;
    if (photo && !image) {
      setUploading(true);
      try {
        const { imageUrl, imagePublicId } = await uploadEventImage(photo.file);
        image = { url: imageUrl, publicId: imagePublicId };
        strandedUpload.current = image;
      } catch (err) {
        setErrors((p) => ({ ...p, imageUrl: toApiError(err).error }));
        setSaving(false);
        return;
      } finally {
        setUploading(false);
      }
    }

    const payload: EventInput = {
      title: values.title,
      // datetime-local has no timezone; treat it as the admin's local time.
      date: new Date(values.date).toISOString(),
      location: values.location || null,
      description: values.description || null,
      imageUrl: image ? image.url : values.imageUrl || null,
      imagePublicId: image ? image.publicId : values.imagePublicId || null,
      published: values.published,
    };

    try {
      if (event) await updateEvent(event.id, payload);
      else await createEvent(payload);
      // Saved — the image now belongs to an event, so nothing to clean up.
      strandedUpload.current = null;
      onSaved();
    } catch (err) {
      const apiError = toApiError(err);
      if (apiError.fields) setErrors(apiError.fields);
      else setFormError(apiError.error);
      setSaving(false);
    }
  }

  const busy = saving || uploading;
  // A freshly picked file wins over whatever the event already had.
  const previewSrc = photo?.preview ?? values.imageUrl;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Focus the title rather than whatever happens to be first tabbable. */}
      <DialogContent className="sm:max-w-2xl" initialFocus={titleRef}>
        <DialogHeader>
          <DialogTitle className="font-display text-lg">
            {event ? t("editEvent") : t("newEvent")}
          </DialogTitle>
          <DialogDescription>{t("eventFormHint")}</DialogDescription>
        </DialogHeader>

        <form
          id="event-form"
          onSubmit={submit}
          noValidate
          className="flex max-h-[60vh] flex-col gap-4 overflow-y-auto px-1 py-1"
        >
          {formError && (
            <p
              role="alert"
              className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive"
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
                ref={titleRef}
                value={values.title}
                onChange={set("title")}
                aria-invalid={!!errors.title}
                className={inputClass(!!errors.title)}
              />
              {errors.title && (
                <span role="alert" className="text-xs text-destructive">
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
                <span role="alert" className="text-xs text-destructive">
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
                <div className="relative aspect-video w-48 shrink-0 overflow-hidden rounded-xl border border-border bg-muted">
                  {previewSrc ? (
                    // Cloudinary is not configured in next.config images; a plain
                    // img keeps this admin-only preview simple.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={previewSrc}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="absolute inset-0 grid place-items-center text-muted-foreground">
                      <ImageIcon className="size-6" aria-hidden />
                    </span>
                  )}
                  {uploading && (
                    <span className="absolute inset-0 grid place-items-center bg-foreground/50 text-cream">
                      <Loader2 className="size-5 animate-spin" aria-hidden />
                      <span className="sr-only">{t("uploadingPhoto")}</span>
                    </span>
                  )}
                </div>

                <div className="flex flex-col items-start gap-2">
                  <input
                    ref={fileRef}
                    id="ev-photo"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={pickPhoto}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={uploading}
                    onClick={() => fileRef.current?.click()}
                  >
                    <Upload aria-hidden />
                    {previewSrc ? t("changePhoto") : t("uploadPhoto")}
                  </Button>
                  {previewSrc && !uploading && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                      onClick={removePhoto}
                    >
                      <Trash2 aria-hidden />
                      {t("removePhoto")}
                    </Button>
                  )}
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                {photo ? t("photoPending") : t("photoHint")}
              </p>
              {errors.imageUrl && (
                <span role="alert" className="text-xs text-destructive">
                  {errors.imageUrl}
                </span>
              )}
            </div>
          </div>

          <label className="flex items-start gap-3 rounded-xl border border-border bg-muted/40 p-3">
            <input
              type="checkbox"
              checked={values.published}
              onChange={(e) =>
                setValues((v) => ({ ...v, published: e.target.checked }))
              }
              className="mt-0.5 size-4 rounded border-border accent-primary"
            />
            <span>
              <span className="block text-sm font-medium text-foreground">
                {t("published")}
              </span>
              <span className="block text-xs text-muted-foreground">
                {t("publishedHint")}
              </span>
            </span>
          </label>
        </form>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={saving}
          >
            {t("cancel")}
          </Button>
          <Button type="submit" form="event-form" disabled={busy}>
            {saving && <Loader2 className="animate-spin" aria-hidden />}
            {saving ? f("submitting") : event ? t("save") : t("create")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
