"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { resendVerification, verifyEmail } from "@/lib/auth";
import { toApiError } from "@/lib/api";
import { EMAIL_RE, inputClass } from "@/components/forms/form-ui";

type State = "verifying" | "success" | "failed";

/** Confirms the token from the email link, with a resend path when it fails. */
export function VerifyEmail() {
  const t = useTranslations("verify");
  const n = useTranslations("nav");
  const f = useTranslations("form");

  const token = useSearchParams().get("token");
  const [state, setState] = useState<State>("verifying");
  const [email, setEmail] = useState("");
  const [resent, setResent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // React runs effects twice in development; only verify once so the
  // single-use token is not immediately consumed by the second run.
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    if (!token) {
      setState("failed");
      return;
    }
    verifyEmail(token)
      .then(() => setState("success"))
      .catch(() => setState("failed"));
  }, [token]);

  async function resend() {
    if (!EMAIL_RE.test(email)) {
      setError(f("invalidEmail"));
      return;
    }
    setError(null);
    try {
      await resendVerification(email);
      setResent(true);
    } catch (err) {
      setError(toApiError(err).error);
    }
  }

  if (state === "verifying") {
    return (
      <p role="status" aria-live="polite" className="text-muted-foreground">
        {t("verifying")}
      </p>
    );
  }

  if (state === "success") {
    return (
      <div className="flex flex-col items-start gap-5">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-bd-green text-cream">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </span>
        <div>
          <h1 className="font-display text-3xl font-semibold text-foreground">
            {t("successTitle")}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">{t("successBody")}</p>
        </div>
        <Link
          href="/login"
          className="rounded-full bg-bd-green px-7 py-3 font-medium text-cream shadow-sm transition-transform hover:scale-[1.03]"
        >
          {t("goLogin")}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-start gap-5">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-madder/15 text-madder">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M12 8v5M12 16.5v.5" />
          <circle cx="12" cy="12" r="9" />
        </svg>
      </span>
      <div>
        <h1 className="font-display text-3xl font-semibold text-foreground">
          {t("failTitle")}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("failBody")}</p>
      </div>

      {resent ? (
        <p
          aria-live="polite"
          className="rounded-lg bg-bd-green/15 px-4 py-3 text-sm text-foreground"
        >
          {t("resent")}
        </p>
      ) : (
        <div className="flex w-full max-w-sm flex-col gap-2">
          <label htmlFor="verify-email" className="text-sm font-medium text-foreground">
            {t("emailPrompt")}
          </label>
          <input
            id="verify-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className={inputClass(!!error)}
          />
          {error && (
            <span role="alert" className="text-xs text-madder">
              {error}
            </span>
          )}
          <button
            type="button"
            onClick={resend}
            className="mt-1 self-start rounded-full bg-bd-green px-6 py-2.5 text-sm font-medium text-cream"
          >
            {t("resend")}
          </button>
        </div>
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
