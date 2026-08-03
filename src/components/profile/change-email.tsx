"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/components/auth/auth-provider";
import { requestEmailChange } from "@/lib/auth";
import { toApiError } from "@/lib/api";
import { EMAIL_RE, inputClass } from "@/components/forms/form-ui";

/**
 * Requests an email change. The confirmation goes to the new address and the
 * account keeps its current email until that link is opened.
 */
export function ChangeEmail() {
  const t = useTranslations("profile");
  const f = useTranslations("form");
  const { user, refresh } = useAuth();

  const [newEmail, setNewEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  if (!user) return null;

  async function submit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);

    const next: Record<string, string> = {};
    if (!EMAIL_RE.test(newEmail)) next.newEmail = f("invalidEmail");
    if (!password) next.password = f("required");
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setStatus("sending");
    try {
      await requestEmailChange(newEmail, password);
      await refresh();
      setPassword("");
      setNewEmail("");
      setStatus("sent");
    } catch (err) {
      const apiError = toApiError(err);
      if (apiError.fields) setErrors(apiError.fields);
      else setFormError(apiError.error);
      setStatus("idle");
    }
  }

  return (
    <section className="rounded-2xl border border-border bg-cream p-6 sm:p-8">
      <h2 className="font-display text-xl font-semibold text-foreground">
        {t("changeEmail")}
      </h2>

      {user.pendingEmail && (
        <p className="mt-4 rounded-lg bg-marigold/15 px-4 py-3 text-sm text-foreground">
          {t("emailPending", { email: user.pendingEmail })}
        </p>
      )}
      {formError && (
        <p role="alert" className="mt-4 rounded-lg bg-madder/10 px-4 py-3 text-sm text-madder">
          {formError}
        </p>
      )}
      {status === "sent" && (
        <p aria-live="polite" className="mt-4 rounded-lg bg-bd-green/15 px-4 py-3 text-sm text-foreground">
          {t("emailChangeSent")}
        </p>
      )}

      <form onSubmit={submit} noValidate className="mt-5 flex max-w-sm flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="ce-email" className="text-sm font-medium text-foreground">
            {t("newEmailLabel")}
          </label>
          <input
            id="ce-email"
            type="email"
            value={newEmail}
            onChange={(e) => {
              setNewEmail(e.target.value);
              setStatus("idle");
              if (errors.newEmail) setErrors((p) => ({ ...p, newEmail: "" }));
            }}
            aria-invalid={!!errors.newEmail}
            className={inputClass(!!errors.newEmail)}
          />
          {errors.newEmail && (
            <span role="alert" className="text-xs text-madder">
              {errors.newEmail}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="ce-password" className="text-sm font-medium text-foreground">
            {t("emailPasswordLabel")}
          </label>
          <input
            id="ce-password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors((p) => ({ ...p, password: "" }));
            }}
            aria-invalid={!!errors.password}
            className={inputClass(!!errors.password)}
          />
          {errors.password && (
            <span role="alert" className="text-xs text-madder">
              {errors.password}
            </span>
          )}
        </div>

        <button
          type="submit"
          disabled={status === "sending"}
          className="self-start rounded-full bg-bd-green px-7 py-2.5 font-medium text-cream transition-transform hover:scale-[1.02] disabled:opacity-60"
        >
          {status === "sending" ? f("submitting") : t("requestChange")}
        </button>
      </form>
    </section>
  );
}
