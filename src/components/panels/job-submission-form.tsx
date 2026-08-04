"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { CheckCircle2, Info, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { inputClass } from "@/components/forms/form-ui";
import { toApiError } from "@/lib/api";
import { euroToCents, submitJob } from "@/lib/job-submission";

/**
 * The form employers use to submit a listing.
 *
 * The interface follows the site language, but the advert itself must be
 * written in German — a notice at the top says so — because our members apply
 * to German employers.
 */

/** Grouped so a list of twelve stays readable. Labels come from messages. */
const TYPE_GROUPS = [
  {
    key: "groupStudying",
    types: [
      "WERKSTUDENT",
      "HIWI",
      "INTERNSHIP",
      "MINIJOB",
      "PART_TIME",
      "THESIS",
      "DUAL_STUDY",
    ],
  },
  {
    key: "groupGraduating",
    types: ["ENTRY_LEVEL", "TRAINEE", "FULL_TIME", "PHD"],
  },
  { key: "groupOther", types: ["FREELANCE"] },
] as const;

const CEFR = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;

const EMPTY = {
  title: "",
  company: "",
  companyWebsite: "",
  location: "",
  remote: false,
  type: "WERKSTUDENT",
  startDate: "",
  until: "",
  hoursPerWeek: "",
  pay: "",
  payUnit: "HOUR",
  payNote: "",
  aboutCompany: "",
  tasks: "",
  profile: "",
  offer: "",
  germanLevel: "",
  contactName: "",
  applyEmail: "",
  applyUrl: "",
  deadline: "",
  submitterName: "",
  submitterEmail: "",
  submitterPhone: "",
  website2: "",
};

export function JobSubmissionForm() {
  const t = useTranslations("postJob");
  const tj = useTranslations("jobs");
  const [v, setV] = useState(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  const set =
    (key: keyof typeof EMPTY) => (e: { target: { value: string } }) => {
      setV((p) => ({ ...p, [key]: e.target.value }));
      if (errors[key]) setErrors((p) => ({ ...p, [key]: "" }));
    };

  async function submit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    setErrors({});

    const payCents = euroToCents(v.pay);
    if (v.pay.trim() !== "" && payCents === null) {
      setErrors({
        payCents: t("invalidAmount"),
      });
      return;
    }

    setSaving(true);
    try {
      await submitJob({
        title: v.title,
        company: v.company,
        companyWebsite: v.companyWebsite || null,
        location: v.location || null,
        remote: v.remote,
        type: v.type as JobTypeValue,
        startDate: v.startDate || null,
        until: v.until || null,
        hoursPerWeek: v.hoursPerWeek ? Number(v.hoursPerWeek) : null,
        payCents,
        payUnit: v.payUnit as "HOUR" | "MONTH",
        payNote: v.payNote || null,
        aboutCompany: v.aboutCompany,
        tasks: v.tasks,
        profile: v.profile,
        offer: v.offer || null,
        germanLevel: v.germanLevel || null,
        contactName: v.contactName || null,
        applyEmail: v.applyEmail || null,
        applyUrl: v.applyUrl || null,
        deadline: v.deadline || null,
        submitterName: v.submitterName,
        submitterEmail: v.submitterEmail,
        submitterPhone: v.submitterPhone || null,
        website2: v.website2,
      });
      setDone(true);
    } catch (err) {
      const apiError = toApiError(err);
      if (apiError.fields) {
        setErrors(apiError.fields);
        setFormError(t("checkFields"));
      } else {
        setFormError(apiError.error);
      }
      setSaving(false);
    }
  }

  if (done) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 rounded-2xl border border-bd-green/40 bg-bd-green/5 px-6 py-14 text-center">
        <CheckCircle2 className="size-10 text-bd-green" aria-hidden />
        <h2 className="font-display text-2xl font-semibold text-foreground">
          {t("doneTitle")}
        </h2>
        <p className="max-w-md text-muted-foreground">{t("doneBody")}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      noValidate
      className="mx-auto flex max-w-3xl flex-col gap-6"
    >
      {/* What we will and will not publish — stated before anyone types. */}
      <div className="flex gap-3.5 rounded-2xl border border-marigold/40 bg-marigold/10 p-5">
        <Info className="mt-0.5 size-5 shrink-0 text-madder" aria-hidden />
        <div className="text-sm text-foreground">
          <p className="font-medium">{t("noticeTitle")}</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
            <li>{t("rule1")}</li>
            <li>{t("rule2")}</li>
            <li>{t("rule3")}</li>
            <li>{t("rule4")}</li>
          </ul>
        </div>
      </div>

      {formError && (
        <p
          role="alert"
          className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {formError}
        </p>
      )}

      <Section step={1} title={t("secPosition")}>
        <Field
          id="title"
          label={t("fTitle")}
          hint={t("fTitleHint")}
          error={errors.title}
          required
        >
          <input
            id="title"
            value={v.title}
            onChange={set("title")}
            className={inputClass(!!errors.title)}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            id="company"
            label={t("fCompany")}
            error={errors.company}
            required
          >
            <input
              id="company"
              value={v.company}
              onChange={set("company")}
              className={inputClass(!!errors.company)}
            />
          </Field>

          <Field
            id="companyWebsite"
            label={t("fWebsite")}
            error={errors.companyWebsite}
          >
            <input
              id="companyWebsite"
              type="url"
              placeholder="https://"
              value={v.companyWebsite}
              onChange={set("companyWebsite")}
              className={inputClass(!!errors.companyWebsite)}
            />
          </Field>

          <Field id="type" label={t("fType")} error={errors.type} required>
            <select
              id="type"
              value={v.type}
              onChange={set("type")}
              className={inputClass(!!errors.type)}
            >
              {TYPE_GROUPS.map((group) => (
                <optgroup key={group.key} label={tj(group.key)}>
                  {group.types.map((type) => (
                    <option key={type} value={type}>
                      {tj(`type${type}`)}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </Field>

          <Field id="location" label={t("fLocation")} error={errors.location}>
            <input
              id="location"
              value={v.location}
              onChange={set("location")}
              className={inputClass(!!errors.location)}
            />
          </Field>
        </div>

        <label className="flex items-center gap-2.5 text-sm text-foreground">
          <input
            type="checkbox"
            checked={v.remote}
            onChange={(e) => setV((p) => ({ ...p, remote: e.target.checked }))}
            className="size-4 rounded border-border accent-bd-green"
          />
          {t("fRemote")}
        </label>

        <div className="grid gap-4 sm:grid-cols-3">
          <Field
            id="startDate"
            label={t("fStart")}
            hint={t("fStartHint")}
            error={errors.startDate}
          >
            <input
              id="startDate"
              type="date"
              value={v.startDate}
              onChange={set("startDate")}
              className={inputClass(!!errors.startDate)}
            />
          </Field>
          <Field
            id="until"
            label={t("fUntil")}
            hint={t("fUntilHint")}
            error={errors.until}
          >
            <input
              id="until"
              type="date"
              value={v.until}
              onChange={set("until")}
              className={inputClass(!!errors.until)}
            />
          </Field>
          <Field
            id="hoursPerWeek"
            label={t("fHours")}
            hint={t("fHoursHint")}
            error={errors.hoursPerWeek}
          >
            <input
              id="hoursPerWeek"
              type="number"
              min={1}
              max={40}
              value={v.hoursPerWeek}
              onChange={set("hoursPerWeek")}
              className={inputClass(!!errors.hoursPerWeek)}
            />
          </Field>
        </div>
      </Section>

      <Section step={2} title={t("secPay")}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            id="pay"
            label={t("fPay")}
            hint={t("fPayHint")}
            error={errors.payCents}
            required
          >
            <input
              id="pay"
              inputMode="decimal"
              placeholder="14,50"
              value={v.pay}
              onChange={set("pay")}
              className={inputClass(!!errors.payCents)}
            />
          </Field>
          <Field id="payUnit" label={t("fPayUnit")} error={errors.payUnit}>
            <select
              id="payUnit"
              value={v.payUnit}
              onChange={set("payUnit")}
              className={inputClass(false)}
            >
              <option value="HOUR">{t("perHour")}</option>
              <option value="MONTH">{t("perMonth")}</option>
            </select>
          </Field>
        </div>
        <Field
          id="payNote"
          label={t("fPayNote")}
          hint={t("fPayNoteHint")}
          error={errors.payNote}
        >
          <input
            id="payNote"
            value={v.payNote}
            onChange={set("payNote")}
            className={inputClass(!!errors.payNote)}
          />
        </Field>
      </Section>

      <Section step={3} title={t("secAdvert")} note={t("germanNotice")}>
        <Field
          id="aboutCompany"
          label={t("fAbout")}
          error={errors.aboutCompany}
          required
        >
          <textarea
            id="aboutCompany"
            rows={3}
            value={v.aboutCompany}
            onChange={set("aboutCompany")}
            className={`${inputClass(!!errors.aboutCompany)} resize-y`}
          />
        </Field>
        <Field id="tasks" label={t("fTasks")} error={errors.tasks} required>
          <textarea
            id="tasks"
            rows={4}
            value={v.tasks}
            onChange={set("tasks")}
            className={`${inputClass(!!errors.tasks)} resize-y`}
          />
        </Field>
        <Field
          id="profile"
          label={t("fProfile")}
          error={errors.profile}
          required
        >
          <textarea
            id="profile"
            rows={4}
            value={v.profile}
            onChange={set("profile")}
            className={`${inputClass(!!errors.profile)} resize-y`}
          />
        </Field>
        <Field id="offer" label={t("fOffer")} error={errors.offer}>
          <textarea
            id="offer"
            rows={3}
            value={v.offer}
            onChange={set("offer")}
            className={`${inputClass(!!errors.offer)} resize-y`}
          />
        </Field>
        <Field
          id="germanLevel"
          label={t("fGerman")}
          hint={t("fGermanHint")}
          error={errors.germanLevel}
        >
          <select
            id="germanLevel"
            value={v.germanLevel}
            onChange={set("germanLevel")}
            className={inputClass(false)}
          >
            <option value="">{t("levelNone")}</option>
            <option value="ENGLISH_OK">{t("levelEnglish")}</option>
            {CEFR.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </Field>
      </Section>

      <Section step={4} title={t("secApply")}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            id="applyEmail"
            label={t("fApplyEmail")}
            error={errors.applyEmail}
          >
            <input
              id="applyEmail"
              type="email"
              value={v.applyEmail}
              onChange={set("applyEmail")}
              className={inputClass(!!errors.applyEmail)}
            />
          </Field>
          <Field id="applyUrl" label={t("fApplyUrl")} error={errors.applyUrl}>
            <input
              id="applyUrl"
              type="url"
              placeholder="https://"
              value={v.applyUrl}
              onChange={set("applyUrl")}
              className={inputClass(!!errors.applyUrl)}
            />
          </Field>
          <Field
            id="contactName"
            label={t("fContactName")}
            error={errors.contactName}
          >
            <input
              id="contactName"
              value={v.contactName}
              onChange={set("contactName")}
              className={inputClass(!!errors.contactName)}
            />
          </Field>
          <Field id="deadline" label={t("fDeadline")} error={errors.deadline}>
            <input
              id="deadline"
              type="date"
              value={v.deadline}
              onChange={set("deadline")}
              className={inputClass(!!errors.deadline)}
            />
          </Field>
        </div>
      </Section>

      <Section step={5} title={t("secContact")} note={t("contactNote")}>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field
            id="submitterName"
            label={t("fName")}
            error={errors.submitterName}
            required
          >
            <input
              id="submitterName"
              value={v.submitterName}
              onChange={set("submitterName")}
              className={inputClass(!!errors.submitterName)}
            />
          </Field>
          <Field
            id="submitterEmail"
            label={t("fEmail")}
            error={errors.submitterEmail}
            required
          >
            <input
              id="submitterEmail"
              type="email"
              value={v.submitterEmail}
              onChange={set("submitterEmail")}
              className={inputClass(!!errors.submitterEmail)}
            />
          </Field>
          <Field
            id="submitterPhone"
            label={t("fPhone")}
            error={errors.submitterPhone}
          >
            <input
              id="submitterPhone"
              value={v.submitterPhone}
              onChange={set("submitterPhone")}
              className={inputClass(!!errors.submitterPhone)}
            />
          </Field>
        </div>
      </Section>

      {/* Honeypot: hidden from people, irresistible to bots. */}
      <div
        aria-hidden
        className="absolute left-[-9999px] h-0 w-0 overflow-hidden"
      >
        <label htmlFor="website2">Leave this empty</label>
        <input
          id="website2"
          tabIndex={-1}
          autoComplete="off"
          value={v.website2}
          onChange={set("website2")}
        />
      </div>

      <div className="sticky bottom-0 -mx-1 flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-background/95 p-4 shadow-lg backdrop-blur">
        <Button type="submit" size="lg" disabled={saving}>
          {saving && <Loader2 className="animate-spin" aria-hidden />}
          {saving ? t("submitting") : t("submit")}
        </Button>
        <p className="text-sm text-muted-foreground">{t("privacyNote")}</p>
      </div>
    </form>
  );
}

type JobTypeValue = "HIWI" | "WERKSTUDENT" | "INTERNSHIP" | "PART_TIME";

function Section({
  step,
  title,
  note,
  children,
}: {
  step: number;
  title: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7">
      {/* A native legend renders on the border itself. The group still needs
          one for screen readers, so it is hidden and the visible heading sits
          inside the card where it belongs. */}
      <legend className="sr-only">{title}</legend>
      <div aria-hidden className="flex items-center gap-3">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-bd-green text-sm font-semibold text-cream">
          {step}
        </span>
        <span className="font-display text-lg font-semibold text-foreground sm:text-xl">
          {title}
        </span>
      </div>
      {note && (
        <p className="mt-3 rounded-lg bg-secondary/60 px-3 py-2 text-sm text-muted-foreground">
          {note}
        </p>
      )}
      <div className="mt-5 flex flex-col gap-4">{children}</div>
    </fieldset>
  );
}

function Field({
  id,
  label,
  hint,
  error,
  required = false,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-madder"> *</span>}
      </label>
      {children}
      {hint && !error && (
        <span className="text-xs text-muted-foreground">{hint}</span>
      )}
      {error && (
        <span role="alert" className="text-xs text-madder">
          {error}
        </span>
      )}
    </div>
  );
}
