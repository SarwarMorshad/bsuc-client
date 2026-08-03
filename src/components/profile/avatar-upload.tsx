"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/components/auth/auth-provider";
import { removeAvatar, uploadAvatar } from "@/lib/auth";
import { toApiError } from "@/lib/api";

/**
 * Profile photo with upload and removal. Falls back to the member's initials
 * whenever no photo is set — which is also the state when image uploads are
 * not configured on the server.
 */
export function AvatarUpload() {
  const t = useTranslations("profile");
  const { user, refresh } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);

  const [status, setStatus] = useState<"idle" | "busy" | "done" | "removed">("idle");
  const [error, setError] = useState<string | null>(null);

  if (!user) return null;

  const initials = user.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setStatus("busy");
    try {
      await uploadAvatar(file);
      await refresh();
      setStatus("done");
    } catch (err) {
      setError(toApiError(err).error);
      setStatus("idle");
    } finally {
      // Allow re-selecting the same file after an error.
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function onRemove() {
    setError(null);
    setStatus("busy");
    try {
      await removeAvatar();
      await refresh();
      setStatus("removed");
    } catch (err) {
      setError(toApiError(err).error);
      setStatus("idle");
    }
  }

  return (
    <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-start sm:gap-5">
      {/* Photo, or initials when none is set */}
      {user.avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={user.avatarUrl}
          alt=""
          className="h-20 w-20 shrink-0 rounded-full object-cover ring-2 ring-border"
        />
      ) : (
        <span
          className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-bd-green font-display text-2xl font-semibold text-cream"
          aria-hidden="true"
        >
          {initials}
        </span>
      )}

      <div className="flex flex-col items-center gap-2 sm:items-start">
        <span className="text-sm font-medium text-foreground">
          {t("photoLabel")}
        </span>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={status === "busy"}
            className="rounded-full border border-indigo/40 px-5 py-2 text-sm font-medium text-indigo transition-colors hover:bg-indigo/5 disabled:opacity-60"
          >
            {status === "busy"
              ? t("uploading")
              : user.avatarUrl
                ? t("changePhoto")
                : t("uploadPhoto")}
          </button>

          {user.avatarUrl && (
            <button
              type="button"
              onClick={onRemove}
              disabled={status === "busy"}
              className="text-sm text-madder underline-offset-4 hover:underline disabled:opacity-60"
            >
              {t("removePhoto")}
            </button>
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={onFile}
          className="sr-only"
          aria-label={t("uploadPhoto")}
        />

        {error ? (
          <span role="alert" className="text-xs text-madder">
            {error}
          </span>
        ) : status === "done" ? (
          <span aria-live="polite" className="text-xs text-bd-green">
            {t("photoUpdated")}
          </span>
        ) : status === "removed" ? (
          <span aria-live="polite" className="text-xs text-bd-green">
            {t("photoRemoved")}
          </span>
        ) : (
          <span className="text-xs text-muted-foreground/80">{t("photoHint")}</span>
        )}
      </div>
    </div>
  );
}
