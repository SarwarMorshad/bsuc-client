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
import { CheckInbox } from "@/components/auth/check-inbox";
import { register as apiRegister } from "@/lib/auth";
import { toApiError } from "@/lib/api";
import { PasswordRequirements } from "@/components/forms/password-requirements";
import { isPasswordValid } from "@/lib/password-rules";

type Errors = Partial<
  Record<
    "name" | "email" | "matriculationNumber" | "program" | "password" | "confirm",
    string
  >
>;

/** Interactive join / sign-up form (client-side only; auth wiring lands in Phase 2). */
export function JoinForm() {
  const t = useTranslations("join");
  const f = useTranslations("form");
  const au = useTranslations("auth");
  const p = useTranslations("pages");

  const [values, setValues] = useState({
    name: "",
    email: "",
    matriculationNumber: "",
    program: "",
    password: "",
    confirm: "",
  });
  const [show, setShow] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "submitting">("idle");
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);

  const set = (key: keyof typeof values) => (e: { target: { value: string } }) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    if (errors[key]) setErrors((pr) => ({ ...pr, [key]: undefined }));
  };

  async function submit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);

    const next: Errors = {};
    if (!values.name.trim()) next.name = f("required");
    if (!values.email.trim()) next.email = f("required");
    else if (!EMAIL_RE.test(values.email)) next.email = f("invalidEmail");
    if (!values.matriculationNumber.trim())
      next.matriculationNumber = f("required");
    if (!values.program.trim()) next.program = f("required");
    if (!isPasswordValid(values.password)) next.password = f("passwordWeak");
    if (values.confirm !== values.password) next.confirm = f("passwordMismatch");
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setStatus("submitting");
    try {
      await apiRegister({
        name: values.name,
        email: values.email,
        matriculationNumber: values.matriculationNumber,
        password: values.password,
        program: values.program,
      });
      // No session is issued until the email is confirmed, so show the
      // "check your inbox" step rather than signing the member in.
      setRegisteredEmail(values.email);
    } catch (err) {
      const apiError = toApiError(err);
      if (apiError.fields) setErrors(apiError.fields);
      else setFormError(apiError.error);
      setStatus("idle");
    }
  }

  if (registeredEmail) {
    return <CheckInbox email={registeredEmail} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-foreground">
          {p("joinTitle")}
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">{p("joinSubtitle")}</p>
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
          <label htmlFor="join-name" className="text-sm font-medium text-foreground">
            {t("nameLabel")}
          </label>
          <input
            id="join-name"
            value={values.name}
            onChange={set("name")}
            placeholder={t("namePlaceholder")}
            aria-invalid={!!errors.name}
            className={inputClass(!!errors.name)}
          />
          {errors.name && <span role="alert" className="text-xs text-madder">{errors.name}</span>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="join-email" className="text-sm font-medium text-foreground">
            {t("emailLabel")}
          </label>
          <input
            id="join-email"
            type="email"
            value={values.email}
            onChange={set("email")}
            placeholder={t("emailPlaceholder")}
            aria-invalid={!!errors.email}
            className={inputClass(!!errors.email)}
          />
          {errors.email && <span role="alert" className="text-xs text-madder">{errors.email}</span>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="join-matriculation"
            className="text-sm font-medium text-foreground"
          >
            {t("matriculationLabel")}
          </label>
          <input
            id="join-matriculation"
            inputMode="numeric"
            value={values.matriculationNumber}
            onChange={set("matriculationNumber")}
            placeholder={t("matriculationPlaceholder")}
            aria-invalid={!!errors.matriculationNumber}
            className={inputClass(!!errors.matriculationNumber)}
          />
          {errors.matriculationNumber && (
            <span role="alert" className="text-xs text-madder">
              {errors.matriculationNumber}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="join-program" className="text-sm font-medium text-foreground">
            {t("programLabel")}
          </label>
          <input
            id="join-program"
            value={values.program}
            onChange={set("program")}
            placeholder={t("programPlaceholder")}
            aria-invalid={!!errors.program}
            className={inputClass(!!errors.program)}
          />
          {errors.program && <span role="alert" className="text-xs text-madder">{errors.program}</span>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="join-password" className="text-sm font-medium text-foreground">
            {t("passwordLabel")}
          </label>
          <div className="relative">
            <input
              id="join-password"
              type={show ? "text" : "password"}
              value={values.password}
              onChange={set("password")}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              placeholder={t("passwordPlaceholder")}
              aria-invalid={!!errors.password}
              aria-describedby="password-requirements"
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
          {/* Also stays open after blurring while the password is still invalid,
              so the member can see what is missing. */}
          <PasswordRequirements
            value={values.password}
            open={
              passwordFocused ||
              (values.password.length > 0 && !isPasswordValid(values.password))
            }
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="join-confirm" className="text-sm font-medium text-foreground">
            {t("confirmLabel")}
          </label>
          <input
            id="join-confirm"
            type={show ? "text" : "password"}
            value={values.confirm}
            onChange={set("confirm")}
            aria-invalid={!!errors.confirm}
            className={inputClass(!!errors.confirm)}
          />
          {errors.confirm && <span role="alert" className="text-xs text-madder">{errors.confirm}</span>}
        </div>

        <button
          type="submit"
          disabled={status === "submitting"}
          className="mt-1 rounded-full bg-bd-green px-6 py-2.5 font-medium text-cream transition-transform hover:scale-[1.02] disabled:opacity-60"
        >
          {status === "submitting" ? f("submitting") : t("submit")}
        </button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        {t("haveAccount")}{" "}
        <Link href="/login" className="font-medium text-brand-blue underline-offset-4 hover:underline">
          {t("loginCta")}
        </Link>
      </p>
    </div>
  );
}
