"use client";

import { useCallback, useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  Building2,
  Check,
  ChevronDown,
  Clock,
  Euro,
  Globe,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { inputClass } from "@/components/forms/form-ui";
import { toApiError } from "@/lib/api";
import { deleteJob, listAllJobs, reviewJob } from "@/lib/admin-jobs";
import {
  formatJobDate,
  formatPay,
  type AdminJob,
  type JobCounts,
} from "@/lib/jobs";

/** The moderation queue: nothing is public until it is approved here. */
export function JobsManager() {
  const t = useTranslations("jobs");
  const a = useTranslations("admin");
  const s = useTranslations("states");
  const locale = useLocale();

  const [jobs, setJobs] = useState<AdminJob[]>([]);
  const [counts, setCounts] = useState<JobCounts>({
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [rejecting, setRejecting] = useState<AdminJob | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [confirming, setConfirming] = useState<AdminJob | null>(null);
  const [now, setNow] = useState(0);

  const load = useCallback(async () => {
    try {
      const data = await listAllJobs();
      setJobs(data.jobs);
      setCounts(data.counts);
      setNow(Date.now());
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

  async function approve(job: AdminJob) {
    setBusyId(job.id);
    setNotice(null);
    try {
      await reviewJob(job.id, "APPROVED");
      await load();
      setNotice(a("saved"));
    } catch (err) {
      setError(toApiError(err).error);
    } finally {
      setBusyId(null);
    }
  }

  async function confirmReject() {
    if (!rejecting) return;
    setBusyId(rejecting.id);
    try {
      await reviewJob(rejecting.id, "REJECTED", rejectReason);
      setRejecting(null);
      setRejectReason("");
      await load();
      setNotice(a("saved"));
    } catch (err) {
      setError(toApiError(err).error);
    } finally {
      setBusyId(null);
    }
  }

  async function confirmDelete() {
    if (!confirming) return;
    setBusyId(confirming.id);
    try {
      await deleteJob(confirming.id);
      setConfirming(null);
      await load();
      setNotice(a("deleted"));
    } catch (err) {
      setError(toApiError(err).error);
    } finally {
      setBusyId(null);
    }
  }

  if (loading) {
    return (
      <p
        role="status"
        aria-live="polite"
        className="flex items-center gap-2 text-muted-foreground"
      >
        <Loader2 className="size-4 animate-spin" aria-hidden />
        {s("loading")}
      </p>
    );
  }

  const isExpired = (j: AdminJob) =>
    j.deadline !== null && new Date(j.deadline).getTime() < now;

  const pending = jobs.filter((j) => j.status === "PENDING");
  const live = jobs.filter((j) => j.status === "APPROVED" && !isExpired(j));
  const expired = jobs.filter((j) => j.status === "APPROVED" && isExpired(j));
  const rejected = jobs.filter((j) => j.status === "REJECTED");

  const card = (job: AdminJob) => (
    <JobReviewCard
      key={job.id}
      job={job}
      locale={locale}
      busy={busyId === job.id}
      expired={isExpired(job)}
      onApprove={() => approve(job)}
      onReject={() => {
        setRejectReason("");
        setRejecting(job);
      }}
      onDelete={() => setConfirming(job)}
    />
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-6 rounded-2xl border border-border bg-card p-4">
        <Stat label={t("pending")} value={counts.pending} highlight />
        <Stat label={t("live")} value={live.length} />
        <Stat label={t("rejectedSection")} value={counts.rejected} />
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {error}
        </p>
      )}
      {notice && (
        <p
          aria-live="polite"
          className="rounded-lg bg-primary/10 px-4 py-3 text-sm text-foreground"
        >
          {notice}
        </p>
      )}

      {jobs.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border px-6 py-12 text-center text-muted-foreground">
          {t("noJobs")}
        </p>
      ) : (
        <div className="flex flex-col gap-10">
          <Section
            title={t("pending")}
            hint={t("pendingHint")}
            count={pending.length}
            highlight
          >
            {pending.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-border px-6 py-8 text-center text-sm text-muted-foreground">
                {t("noPending")}
              </p>
            ) : (
              <ul className="grid gap-4">{pending.map(card)}</ul>
            )}
          </Section>

          {live.length > 0 && (
            <Section title={t("live")} hint={t("liveHint")} count={live.length}>
              <ul className="grid gap-4">{live.map(card)}</ul>
            </Section>
          )}

          {expired.length > 0 && (
            <Section title={t("expired")} hint="" count={expired.length}>
              <ul className="grid gap-4">{expired.map(card)}</ul>
            </Section>
          )}

          {rejected.length > 0 && (
            <Section
              title={t("rejectedSection")}
              hint=""
              count={rejected.length}
            >
              <ul className="grid gap-4">{rejected.map(card)}</ul>
            </Section>
          )}
        </div>
      )}

      <Dialog
        open={rejecting !== null}
        onOpenChange={(o) => !o && setRejecting(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display text-lg">
              {t("rejectTitle")}
            </DialogTitle>
            <DialogDescription>{rejecting?.title}</DialogDescription>
          </DialogHeader>
          <label className="flex flex-col gap-1.5 px-1">
            <span className="text-sm font-medium text-foreground">
              {t("rejectReason")}
            </span>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className={`${inputClass(false)} resize-y`}
            />
          </label>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRejecting(null)}
              disabled={busyId !== null}
            >
              {a("cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={confirmReject}
              disabled={busyId !== null}
            >
              {busyId !== null && (
                <Loader2 className="animate-spin" aria-hidden />
              )}
              {t("reject")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={confirming !== null}
        onOpenChange={(o) => !o && setConfirming(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display text-lg">
              {t("deleteJob")}
            </DialogTitle>
            <DialogDescription>
              {t("confirmDeleteJob", { title: confirming?.title ?? "" })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirming(null)}
              disabled={busyId !== null}
            >
              {a("cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={busyId !== null}
            >
              {busyId !== null && (
                <Loader2 className="animate-spin" aria-hidden />
              )}
              {t("deleteJob")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Stat({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      {highlight && value > 0 && (
        <span
          aria-hidden
          className="size-2 shrink-0 rounded-full bg-marigold"
        />
      )}
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="font-display text-lg font-semibold text-foreground">
        {value}
      </span>
    </div>
  );
}

function Section({
  title,
  hint,
  count,
  highlight = false,
  children,
}: {
  title: string;
  hint: string;
  count: number;
  highlight?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          {highlight && count > 0 && (
            <span
              aria-hidden
              className="size-2 shrink-0 rounded-full bg-marigold"
            />
          )}
          <h2 className="font-display text-lg font-semibold text-foreground">
            {title}
          </h2>
          <Badge variant="secondary">{count}</Badge>
        </div>
        {hint && <p className="text-sm text-muted-foreground">{hint}</p>}
      </div>
      {children}
    </section>
  );
}

/**
 * One listing awaiting a decision. The submitter's details sit right next to
 * the Approve button, because judging whether the employer is real is the
 * whole point of this screen.
 */
function JobReviewCard({
  job,
  locale,
  busy,
  expired,
  onApprove,
  onReject,
  onDelete,
}: {
  job: AdminJob;
  locale: string;
  busy: boolean;
  expired: boolean;
  onApprove: () => void;
  onReject: () => void;
  onDelete: () => void;
}) {
  const t = useTranslations("jobs");
  const [open, setOpen] = useState(false);

  const pay = formatPay(job.payCents, job.payUnit, {
    perHour: t("perHour"),
    perMonth: t("perMonth"),
  });

  return (
    <li
      className={`flex flex-col gap-3 rounded-2xl border bg-card p-4 ${
        job.status === "PENDING" ? "border-marigold/50" : "border-border"
      } ${expired || job.status === "REJECTED" ? "opacity-75" : ""}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{t(`type${job.type}`)}</Badge>
            {job.remote && <Badge variant="secondary">{t("remote")}</Badge>}
            {expired && <Badge variant="secondary">{t("expired")}</Badge>}
          </div>
          <h3 className="mt-2 font-display text-lg leading-tight font-semibold text-foreground">
            {job.title}
          </h3>
          <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Building2 className="size-3.5 shrink-0" aria-hidden />
              {job.company}
            </span>
            {job.location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="size-3.5 shrink-0" aria-hidden />
                {job.location}
              </span>
            )}
            {pay && (
              <span className="flex items-center gap-1.5">
                <Euro className="size-3.5 shrink-0" aria-hidden />
                {pay}
              </span>
            )}
            {job.hoursPerWeek && (
              <span className="flex items-center gap-1.5">
                <Clock className="size-3.5 shrink-0" aria-hidden />
                {t("hoursWeek", { n: job.hoursPerWeek })}
              </span>
            )}
          </p>
        </div>

        {job.status === "PENDING" && (
          <div className="flex shrink-0 gap-2">
            <Button size="sm" onClick={onApprove} disabled={busy}>
              {busy ? (
                <Loader2 className="animate-spin" aria-hidden />
              ) : (
                <Check aria-hidden />
              )}
              {t("approve")}
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={onReject}
              disabled={busy}
            >
              <X aria-hidden />
              {t("reject")}
            </Button>
          </div>
        )}
      </div>

      {/* Who sent it in — the signals that say whether this is legitimate. */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1 rounded-xl bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
        <span className="font-medium text-foreground">{t("submittedBy")}:</span>
        <span>{job.submitterName}</span>
        <a
          href={`mailto:${job.submitterEmail}`}
          className="flex items-center gap-1.5 hover:text-foreground"
        >
          <Mail className="size-3 shrink-0" aria-hidden />
          {job.submitterEmail}
        </a>
        {job.submitterPhone && (
          <span className="flex items-center gap-1.5">
            <Phone className="size-3 shrink-0" aria-hidden />
            {job.submitterPhone}
          </span>
        )}
        {job.companyWebsite && (
          <a
            href={job.companyWebsite}
            target="_blank"
            rel="noreferrer nofollow"
            className="flex items-center gap-1.5 hover:text-foreground"
          >
            <Globe className="size-3 shrink-0" aria-hidden />
            {t("website")}
          </a>
        )}
      </div>

      {job.rejectionReason && (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {job.rejectionReason}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronDown
            className={`size-4 transition-transform ${open ? "rotate-180" : ""}`}
            aria-hidden
          />
          {open ? t("hideDetails") : t("viewDetails")}
        </button>
        <Button
          size="sm"
          variant="destructive"
          className="ml-auto"
          onClick={onDelete}
          disabled={busy}
        >
          <Trash2 aria-hidden />
          {t("deleteJob")}
        </Button>
      </div>

      {open && (
        <div className="flex flex-col gap-4 border-t border-border pt-4 text-sm">
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
            {job.deadline && (
              <Row
                label={t("deadlineLabel")}
                value={formatJobDate(job.deadline, locale)}
              />
            )}
            {job.germanLevel && (
              <Row
                label={t("germanLevel")}
                value={
                  job.germanLevel === "ENGLISH_OK"
                    ? t("englishOk")
                    : job.germanLevel
                }
              />
            )}
            {job.payNote && <Row label="" value={job.payNote} />}
            <Row
              label={t("applyVia")}
              value={job.applyEmail ?? job.applyUrl ?? "—"}
            />
          </dl>
        </div>
      )}
    </li>
  );
}

function Block({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h4 className="font-medium text-foreground">{title}</h4>
      <p className="mt-1 whitespace-pre-line text-muted-foreground">{body}</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      {label && <dt className="font-medium text-foreground">{label}:</dt>}
      <dd className="min-w-0 break-words">{value}</dd>
    </div>
  );
}
