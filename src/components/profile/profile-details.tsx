"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/components/auth/auth-provider";
import { updateProfile, type DegreeLevel } from "@/lib/auth";
import { toApiError } from "@/lib/api";
import { inputClass } from "@/components/forms/form-ui";

/** Read-only field shown for values members cannot change here. */
function LockedField({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <div className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-sm text-muted-foreground">
        {value}
      </div>
      <span className="text-xs text-muted-foreground/80">{note}</span>
    </div>
  );
}

/** Edit form for the details a member is allowed to change themselves. */
export function ProfileDetails() {
  const t = useTranslations("profile");
  const f = useTranslations("form");
  const { user, refresh } = useAuth();

  const [values, setValues] = useState({
    name: user?.name ?? "",
    program: user?.program ?? "",
    countryRegion: user?.countryRegion ?? "",
    year: user?.year ? String(user.year) : "",
    phone: user?.phone ?? "",
    degreeLevel: user?.degreeLevel ?? "",
    arrivalYear: user?.arrivalYear ? String(user.arrivalYear) : "",
    bio: user?.bio ?? "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");

  if (!user) return null;

  const set =
    (key: keyof typeof values) => (e: { target: { value: string } }) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    setStatus("idle");
    if (errors[key]) setErrors((p) => ({ ...p, [key]: "" }));
  };

  async function submit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (!values.name.trim()) {
      setErrors({ name: f("required") });
      return;
    }

    setStatus("saving");
    try {
      await updateProfile({
        name: values.name,
        program: values.program || null,
        countryRegion: values.countryRegion || null,
        year: values.year ? Number(values.year) : null,
        phone: values.phone || null,
        degreeLevel: (values.degreeLevel || null) as DegreeLevel | null,
        arrivalYear: values.arrivalYear ? Number(values.arrivalYear) : null,
        bio: values.bio || null,
      });
      await refresh();
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
        {t("details")}
      </h2>

      {formError && (
        <p role="alert" className="mt-4 rounded-lg bg-madder/10 px-4 py-3 text-sm text-madder">
          {formError}
        </p>
      )}
      {status === "saved" && (
        <p aria-live="polite" className="mt-4 rounded-lg bg-bd-green/15 px-4 py-3 text-sm text-foreground">
          {t("saved")}
        </p>
      )}

      <form onSubmit={submit} noValidate className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label htmlFor="p-name" className="text-sm font-medium text-foreground">
            {t("nameLabel")}
          </label>
          <input
            id="p-name"
            value={values.name}
            onChange={set("name")}
            aria-invalid={!!errors.name}
            className={inputClass(!!errors.name)}
          />
          {errors.name && (
            <span role="alert" className="text-xs text-madder">
              {errors.name}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="p-program" className="text-sm font-medium text-foreground">
            {t("programLabel")}
          </label>
          <input
            id="p-program"
            value={values.program}
            onChange={set("program")}
            className={inputClass(!!errors.program)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="p-region" className="text-sm font-medium text-foreground">
            {t("regionLabel")}
          </label>
          <input
            id="p-region"
            value={values.countryRegion}
            onChange={set("countryRegion")}
            placeholder={t("regionPlaceholder")}
            className={inputClass(!!errors.countryRegion)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="p-year" className="text-sm font-medium text-foreground">
            {t("yearLabel")}
          </label>
          <input
            id="p-year"
            type="number"
            min={1}
            max={12}
            value={values.year}
            onChange={set("year")}
            aria-invalid={!!errors.year}
            className={inputClass(!!errors.year)}
          />
          {errors.year && (
            <span role="alert" className="text-xs text-madder">
              {errors.year}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="p-degree" className="text-sm font-medium text-foreground">
            {t("degreeLabel")}
          </label>
          <select
            id="p-degree"
            value={values.degreeLevel}
            onChange={set("degreeLevel")}
            className={inputClass(false)}
          >
            <option value="">{t("choose")}</option>
            <option value="BACHELOR">{t("bachelor")}</option>
            <option value="MASTER">{t("master")}</option>
            <option value="PHD">{t("phd")}</option>
            <option value="OTHER">{t("otherDegree")}</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="p-arrival" className="text-sm font-medium text-foreground">
            {t("arrivalLabel")}
          </label>
          <input
            id="p-arrival"
            type="number"
            min={1990}
            max={new Date().getFullYear() + 1}
            value={values.arrivalYear}
            onChange={set("arrivalYear")}
            aria-invalid={!!errors.arrivalYear}
            className={inputClass(!!errors.arrivalYear)}
          />
          {errors.arrivalYear && (
            <span role="alert" className="text-xs text-madder">
              {errors.arrivalYear}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label htmlFor="p-phone" className="text-sm font-medium text-foreground">
            {t("phoneLabel")}
          </label>
          <input
            id="p-phone"
            type="tel"
            value={values.phone}
            onChange={set("phone")}
            placeholder="+49 …"
            aria-invalid={!!errors.phone}
            className={inputClass(!!errors.phone)}
          />
          {errors.phone ? (
            <span role="alert" className="text-xs text-madder">
              {errors.phone}
            </span>
          ) : (
            <span className="text-xs text-muted-foreground/80">{t("phoneHint")}</span>
          )}
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label htmlFor="p-bio" className="text-sm font-medium text-foreground">
            {t("bioLabel")}
          </label>
          <textarea
            id="p-bio"
            rows={3}
            maxLength={500}
            value={values.bio}
            onChange={set("bio")}
            className={`${inputClass(!!errors.bio)} resize-y`}
          />
          <span className="text-xs text-muted-foreground/80">{t("bioHint")}</span>
        </div>

        {/* Not editable here — see the API for why */}
        <LockedField label={t("emailLabel")} value={user.email} note={t("locked")} />
        <LockedField
          label={t("matriculationLabel")}
          value={user.matriculationNumber}
          note={t("locked")}
        />

        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={status === "saving"}
            className="rounded-full bg-bd-green px-7 py-2.5 font-medium text-cream transition-transform hover:scale-[1.02] disabled:opacity-60"
          >
            {status === "saving" ? f("submitting") : t("save")}
          </button>
        </div>
      </form>
    </section>
  );
}
