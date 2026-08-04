"use client";

import { useCallback, useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  Building2,
  CalendarClock,
  Clock,
  Euro,
  ExternalLink,
  Globe,
  Loader2,
  MapPin,
  ShieldAlert,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toApiError } from "@/lib/api";
import { listJobs } from "@/lib/admin-jobs";
import { formatJobDate, formatPay, type Job, type JobType } from "@/lib/jobs";

const TYPES: JobType[] = ["HIWI", "WERKSTUDENT", "INTERNSHIP", "PART_TIME"];

/** The members-only job portal. Adverts are German; the chrome is translated. */
export function Jobs() {
  const t = useTranslations("jobs");
  const s = useTranslations("states");
  const locale = useLocale();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<JobType | "ALL">("ALL");

  const load = useCallback(async () => {
    try {
      setJobs(await listJobs());
      setError(null);
    } catch (err) {
      setError(toApiError(err).error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const shown = filter === "ALL" ? jobs : jobs.filter((j) => j.type === filter);

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-6">
        <p className="text-muted-foreground">{t("jobsIntro")}</p>

        {/* Two things every member should read before applying. */}
        <div className="flex flex-col gap-3 rounded-2xl border border-marigold/40 bg-marigold/10 p-4">
          <p className="flex gap-2.5 text-sm text-foreground">
            <ShieldAlert
              className="mt-0.5 size-4 shrink-0 text-madder"
              aria-hidden
            />
            {t("scamWarning")}
          </p>
          <p className="flex gap-2.5 text-sm text-muted-foreground">
            <CalendarClock className="mt-0.5 size-4 shrink-0" aria-hidden />
            {t("workRules")}
          </p>
        </div>

        {loading ? (
          <p
            role="status"
            aria-live="polite"
            className="flex items-center gap-2 text-muted-foreground"
          >
            <Loader2 className="size-4 animate-spin" aria-hidden />
            {s("loading")}
          </p>
        ) : error ? (
          <p
            role="alert"
            className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            {error}
          </p>
        ) : (
          <>
            <div className="flex flex-wrap gap-2">
              <FilterChip
                label={t("filterAll")}
                active={filter === "ALL"}
                onClick={() => setFilter("ALL")}
              />
              {TYPES.map((type) => (
                <FilterChip
                  key={type}
                  label={t(`type${type}`)}
                  active={filter === type}
                  onClick={() => setFilter(type)}
                />
              ))}
            </div>

            {shown.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-border px-6 py-14 text-center text-muted-foreground">
                {t("noJobs")}
              </p>
            ) : (
              <ul className="flex flex-col gap-5">
                {shown.map((job) => (
                  <JobCard key={job.id} job={job} locale={locale} />
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </section>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
        active
          ? "border-bd-green bg-bd-green text-cream"
          : "border-border text-muted-foreground hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );
}

function JobCard({ job, locale }: { job: Job; locale: string }) {
  const t = useTranslations("jobs");
  const [open, setOpen] = useState(false);

  const pay = formatPay(job.payCents, job.payUnit, {
    perHour: t("perHour"),
    perMonth: t("perMonth"),
  });

  return (
    <li className="overflow-hidden rounded-2xl border border-border bg-background shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-col gap-3 p-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{t(`type${job.type}`)}</Badge>
          {job.remote && <Badge variant="secondary">{t("remote")}</Badge>}
          {job.germanLevel && (
            <Badge variant="outline">
              {job.germanLevel === "ENGLISH_OK"
                ? t("englishOk")
                : `${t("germanLevel")} ${job.germanLevel}`}
            </Badge>
          )}
        </div>

        <h3 className="font-display text-xl leading-tight font-semibold text-foreground">
          {job.title}
        </h3>

        <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Building2 className="size-4 shrink-0" aria-hidden />
            {job.companyWebsite ? (
              <a
                href={job.companyWebsite}
                target="_blank"
                rel="noreferrer nofollow"
                className="hover:text-foreground hover:underline"
              >
                {job.company}
              </a>
            ) : (
              job.company
            )}
          </span>
          {job.location && (
            <span className="flex items-center gap-1.5">
              <MapPin className="size-4 shrink-0" aria-hidden />
              {job.location}
            </span>
          )}
          {pay && (
            <span className="flex items-center gap-1.5 font-medium text-foreground">
              <Euro className="size-4 shrink-0" aria-hidden />
              {pay}
            </span>
          )}
          {job.hoursPerWeek && (
            <span className="flex items-center gap-1.5">
              <Clock className="size-4 shrink-0" aria-hidden />
              {t("hoursWeek", { n: job.hoursPerWeek })}
            </span>
          )}
        </div>

        {job.payNote && (
          <p className="text-sm text-muted-foreground">{job.payNote}</p>
        )}

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? t("hideDetails") : t("viewDetails")}
          </Button>

          {(job.applyEmail || job.applyUrl) && (
            <a
              href={
                job.applyUrl ??
                `mailto:${job.applyEmail}?subject=${encodeURIComponent(job.title)}`
              }
              target={job.applyUrl ? "_blank" : undefined}
              rel={job.applyUrl ? "noreferrer nofollow" : undefined}
              className="inline-flex items-center gap-1.5 rounded-full bg-bd-green px-5 py-1.5 text-sm font-medium text-cream transition-transform hover:scale-[1.03]"
            >
              {t("applyVia")}
              {job.applyUrl ? (
                <ExternalLink className="size-3.5" aria-hidden />
              ) : (
                <Globe className="size-3.5" aria-hidden />
              )}
            </a>
          )}

          {job.deadline && (
            <span className="ml-auto text-sm text-muted-foreground">
              {t("deadlineLabel")}: {formatJobDate(job.deadline, locale)}
            </span>
          )}
        </div>
      </div>

      {open && (
        <div className="flex flex-col gap-4 border-t border-border bg-secondary/40 p-6 text-sm">
          <Block title={t("aboutCompany")} body={job.aboutCompany} />
          <Block title={t("tasks")} body={job.tasks} />
          <Block title={t("profileLabel")} body={job.profile} />
          {job.offer && <Block title={t("offer")} body={job.offer} />}
          <dl className="grid gap-x-6 gap-y-1 text-muted-foreground sm:grid-cols-2">
            <Row
              label={t("startsLabel")}
              value={
                job.startDate ? formatJobDate(job.startDate, locale) : t("asap")
              }
            />
            <Row
              label={t("untilLabel")}
              value={
                job.until ? formatJobDate(job.until, locale) : t("openEnded")
              }
            />
            {job.contactName && (
              <Row label={t("contact")} value={job.contactName} />
            )}
          </dl>
        </div>
      )}
    </li>
  );
}

function Block({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h4 className="font-display font-semibold text-foreground">{title}</h4>
      <p className="mt-1 leading-relaxed whitespace-pre-line text-muted-foreground">
        {body}
      </p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <dt className="font-medium text-foreground">{label}:</dt>
      <dd className="min-w-0 break-words">{value}</dd>
    </div>
  );
}
