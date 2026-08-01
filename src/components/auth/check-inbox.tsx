"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { resendVerification } from "@/lib/auth";
import { toApiError } from "@/lib/api";

/** Shown after registering: tells the member to confirm their address. */
export function CheckInbox({ email }: { email: string }) {
  const t = useTranslations("verify");
  const n = useTranslations("nav");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  async function resend() {
    setStatus("sending");
    setError(null);
    try {
      await resendVerification(email);
      setStatus("sent");
    } catch (err) {
      setError(toApiError(err).error);
      setStatus("idle");
    }
  }

  return (
    <div className="flex flex-col items-start gap-5">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-bd-green/15 text-bd-green">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="5" width="18" height="14" rx="2.5" />
          <path d="M4 7l8 6 8-6" />
        </svg>
      </span>

      <div>
        <h1 className="font-display text-3xl font-semibold text-foreground">
          {t("title")}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {t("body", { email })}
        </p>
      </div>

      <p className="text-xs text-muted-foreground">{t("spam")}</p>

      {status === "sent" ? (
        <p
          aria-live="polite"
          className="rounded-lg bg-bd-green/15 px-4 py-3 text-sm text-foreground"
        >
          {t("resent")}
        </p>
      ) : (
        <button
          type="button"
          onClick={resend}
          disabled={status === "sending"}
          className="rounded-full border border-indigo/40 px-6 py-2.5 text-sm font-medium text-indigo transition-colors hover:bg-indigo/5 disabled:opacity-60"
        >
          {t("resend")}
        </button>
      )}

      {error && (
        <p role="alert" className="text-sm text-madder">
          {error}
        </p>
      )}

      <Link
        href="/login"
        className="text-sm font-medium text-brand-blue underline-offset-4 hover:underline"
      >
        {n("login")}
      </Link>
    </div>
  );
}
