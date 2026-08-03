"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { changePassword } from "@/lib/auth";
import { toApiError } from "@/lib/api";
import { EyeIcon, inputClass } from "@/components/forms/form-ui";
import { PasswordRequirements } from "@/components/forms/password-requirements";
import { isPasswordValid } from "@/lib/password-rules";

type Errors = Partial<Record<"currentPassword" | "newPassword" | "confirm", string>>;

export function ChangePassword() {
  const t = useTranslations("profile");
  const f = useTranslations("form");

  const [values, setValues] = useState({
    currentPassword: "",
    newPassword: "",
    confirm: "",
  });
  const [show, setShow] = useState(false);
  const [focused, setFocused] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");

  const set = (key: keyof typeof values) => (e: { target: { value: string } }) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    setStatus("idle");
    if (errors[key]) setErrors((p) => ({ ...p, [key]: undefined }));
  };

  async function submit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);

    const next: Errors = {};
    if (!values.currentPassword) next.currentPassword = f("required");
    if (!isPasswordValid(values.newPassword)) next.newPassword = f("passwordWeak");
    if (values.confirm !== values.newPassword) next.confirm = f("passwordMismatch");
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setStatus("saving");
    try {
      await changePassword(values.currentPassword, values.newPassword);
      setValues({ currentPassword: "", newPassword: "", confirm: "" });
      setStatus("saved");
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
        {t("security")}
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">{t("changePassword")}</p>

      {formError && (
        <p role="alert" className="mt-4 rounded-lg bg-madder/10 px-4 py-3 text-sm text-madder">
          {formError}
        </p>
      )}
      {status === "saved" && (
        <p aria-live="polite" className="mt-4 rounded-lg bg-bd-green/15 px-4 py-3 text-sm text-foreground">
          {t("passwordUpdated")}
        </p>
      )}

      <form onSubmit={submit} noValidate className="mt-5 flex max-w-sm flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="cp-current" className="text-sm font-medium text-foreground">
            {t("currentPassword")}
          </label>
          <input
            id="cp-current"
            type="password"
            value={values.currentPassword}
            onChange={set("currentPassword")}
            aria-invalid={!!errors.currentPassword}
            className={inputClass(!!errors.currentPassword)}
          />
          {errors.currentPassword && (
            <span role="alert" className="text-xs text-madder">
              {errors.currentPassword}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="cp-new" className="text-sm font-medium text-foreground">
            {t("newPassword")}
          </label>
          <div className="relative">
            <input
              id="cp-new"
              type={show ? "text" : "password"}
              value={values.newPassword}
              onChange={set("newPassword")}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              aria-invalid={!!errors.newPassword}
              className={`${inputClass(!!errors.newPassword)} pr-10`}
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              aria-label={show ? f("hidePassword") : f("showPassword")}
              className="absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <EyeIcon open={show} />
            </button>
          </div>
          {errors.newPassword && (
            <span role="alert" className="text-xs text-madder">
              {errors.newPassword}
            </span>
          )}
          <PasswordRequirements
            value={values.newPassword}
            open={
              focused ||
              (values.newPassword.length > 0 && !isPasswordValid(values.newPassword))
            }
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="cp-confirm" className="text-sm font-medium text-foreground">
            {t("confirmNewPassword")}
          </label>
          <input
            id="cp-confirm"
            type={show ? "text" : "password"}
            value={values.confirm}
            onChange={set("confirm")}
            aria-invalid={!!errors.confirm}
            className={inputClass(!!errors.confirm)}
          />
          {errors.confirm && (
            <span role="alert" className="text-xs text-madder">
              {errors.confirm}
            </span>
          )}
        </div>

        <button
          type="submit"
          disabled={status === "saving"}
          className="self-start rounded-full bg-bd-green px-7 py-2.5 font-medium text-cream transition-transform hover:scale-[1.02] disabled:opacity-60"
        >
          {status === "saving" ? f("submitting") : t("updatePassword")}
        </button>
      </form>
    </section>
  );
}
