"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import { deleteAccount } from "@/lib/auth";
import { toApiError } from "@/lib/api";
import { inputClass } from "@/components/forms/form-ui";

/**
 * Permanent account deletion. Requires the password and a typed confirmation,
 * so it cannot be triggered by a stray click.
 */
export function DeleteAccount() {
  const t = useTranslations("profile");
  const f = useTranslations("form");
  const { refresh } = useAuth();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "deleting">("idle");

  const confirmWord = t("deleteConfirmWord");

  async function submit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);

    const next: Record<string, string> = {};
    if (confirmText.trim() !== confirmWord) next.confirm = t("deleteMismatch");
    if (!password) next.password = f("required");
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setStatus("deleting");
    try {
      await deleteAccount(password);
      await refresh();
      router.replace("/");
    } catch (err) {
      const apiError = toApiError(err);
      if (apiError.fields) setErrors(apiError.fields);
      else setFormError(apiError.error);
      setStatus("idle");
    }
  }

  return (
    <section className="rounded-2xl border-2 border-dashed border-madder/40 bg-madder/5 p-6 sm:p-8">
      <h2 className="font-display text-xl font-semibold text-madder">
        {t("dangerZone")}
      </h2>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
        {t("dangerBody")}
      </p>
      <Link
        href="/privacy"
        className="mt-2 inline-block text-sm text-brand-blue underline-offset-4 hover:underline"
      >
        {t("privacyLink")}
      </Link>

      {!open ? (
        <div className="mt-5">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-full border border-madder px-6 py-2.5 text-sm font-medium text-madder transition-colors hover:bg-madder hover:text-cream"
          >
            {t("deleteButton")}
          </button>
        </div>
      ) : (
        <form onSubmit={submit} noValidate className="mt-5 flex max-w-sm flex-col gap-4">
          {formError && (
            <p role="alert" className="rounded-lg bg-madder/10 px-4 py-3 text-sm text-madder">
              {formError}
            </p>
          )}

          <div className="flex flex-col gap-1.5">
            <label htmlFor="da-confirm" className="text-sm font-medium text-foreground">
              {t("deleteConfirmLabel")}
            </label>
            <input
              id="da-confirm"
              value={confirmText}
              onChange={(e) => {
                setConfirmText(e.target.value);
                if (errors.confirm) setErrors((p) => ({ ...p, confirm: "" }));
              }}
              placeholder={confirmWord}
              aria-invalid={!!errors.confirm}
              className={inputClass(!!errors.confirm)}
            />
            {errors.confirm && (
              <span role="alert" className="text-xs text-madder">
                {errors.confirm}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="da-password" className="text-sm font-medium text-foreground">
              {t("deletePasswordLabel")}
            </label>
            <input
              id="da-password"
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

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={status === "deleting"}
              className="rounded-full bg-madder px-7 py-2.5 font-medium text-cream disabled:opacity-60"
            >
              {status === "deleting" ? f("submitting") : t("deleteButton")}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
