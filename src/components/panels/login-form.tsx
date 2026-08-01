"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import {
  Divider,
  EMAIL_RE,
  EyeIcon,
  GoogleButton,
  inputClass,
} from "@/components/forms/form-ui";
import { useAuth } from "@/components/auth/auth-provider";
import { login as apiLogin } from "@/lib/auth";
import { toApiError } from "@/lib/api";

/** Interactive member login form (client-side only; auth wiring lands in Phase 2). */
export function LoginForm() {
  const t = useTranslations("login");
  const f = useTranslations("form");
  const au = useTranslations("auth");
  const p = useTranslations("pages");
  const j = useTranslations("join");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "submitting">("idle");

  const { refresh } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  // Return the member to the page that sent them here, if any.
  const next = searchParams.get("next");

  async function submit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);

    const fieldErrors: typeof errors = {};
    if (!email.trim()) fieldErrors.email = f("required");
    else if (!EMAIL_RE.test(email)) fieldErrors.email = f("invalidEmail");
    if (!password) fieldErrors.password = f("required");
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;

    setStatus("submitting");
    try {
      await apiLogin(email, password);
      await refresh();
      router.replace(next && next.startsWith("/") ? next : "/");
    } catch (err) {
      const apiError = toApiError(err);
      if (apiError.fields) setErrors(apiError.fields);
      else setFormError(apiError.error);
      setStatus("idle");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-foreground">
          {p("loginTitle")}
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {p("loginSubtitle")}
        </p>
      </div>

      {formError && (
        <p
          role="alert"
          className="rounded-lg bg-madder/10 px-4 py-3 text-sm text-madder"
        >
          {formError}
        </p>
      )}

      <GoogleButton label={au("google")} />
      <Divider label={au("orEmail")} />

      <form onSubmit={submit} noValidate className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="login-email" className="text-sm font-medium text-foreground">
            {t("emailLabel")}
          </label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((pr) => ({ ...pr, email: undefined }));
            }}
            placeholder={t("emailPlaceholder")}
            aria-invalid={!!errors.email}
            className={inputClass(!!errors.email)}
          />
          {errors.email && <span role="alert" className="text-xs text-madder">{errors.email}</span>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="login-password" className="text-sm font-medium text-foreground">
            {t("passwordLabel")}
          </label>
          <div className="relative">
            <input
              id="login-password"
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((pr) => ({ ...pr, password: undefined }));
              }}
              placeholder={t("passwordPlaceholder")}
              aria-invalid={!!errors.password}
              className={`${inputClass(!!errors.password)} pr-10`}
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
          {errors.password && <span role="alert" className="text-xs text-madder">{errors.password}</span>}
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 rounded border-border accent-bd-green"
            />
            {au("remember")}
          </label>
          <button type="button" className="text-sm text-brand-blue hover:underline">
            {t("forgot")}
          </button>
        </div>

        <button
          type="submit"
          disabled={status === "submitting"}
          className="mt-1 rounded-full bg-bd-green px-6 py-2.5 font-medium text-cream transition-transform hover:scale-[1.02] disabled:opacity-60"
        >
          {status === "submitting" ? f("submitting") : t("button")}
        </button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        {t("noAccount")}{" "}
        <Link href="/join" className="font-medium text-brand-blue underline-offset-4 hover:underline">
          {j("cta")}
        </Link>
      </p>
    </div>
  );
}
