"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  Divider,
  EMAIL_RE,
  EyeIcon,
  GoogleButton,
  inputClass,
} from "@/components/forms/form-ui";

/** Interactive member login form (client-side only; auth wiring lands in Phase 2). */
export function LoginForm({ onSwitch }: { onSwitch?: () => void }) {
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
  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle");

  function submit(e: FormEvent) {
    e.preventDefault();
    const next: typeof errors = {};
    if (!email.trim()) next.email = f("required");
    else if (!EMAIL_RE.test(email)) next.email = f("invalidEmail");
    if (!password) next.password = f("required");
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setStatus("submitting");
    window.setTimeout(() => setStatus("done"), 700);
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

      {status === "done" && (
        <p className="rounded-lg bg-bd-green/15 px-4 py-3 text-sm text-foreground">
          {f("demoNote")}
        </p>
      )}

      <GoogleButton label={au("google")} onClick={() => setStatus("done")} />
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
          {errors.email && <span className="text-xs text-madder">{errors.email}</span>}
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
          {errors.password && <span className="text-xs text-madder">{errors.password}</span>}
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
        {onSwitch ? (
          <button
            type="button"
            onClick={onSwitch}
            className="font-medium text-brand-blue underline-offset-4 hover:underline"
          >
            {j("cta")}
          </button>
        ) : (
          <Link href="/join" className="font-medium text-brand-blue underline-offset-4 hover:underline">
            {j("cta")}
          </Link>
        )}
      </p>
    </div>
  );
}
