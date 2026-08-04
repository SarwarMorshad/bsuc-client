"use client";

import { useCallback, useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  Building2,
  Check,
  Clock,
  Euro,
  FileText,
  Globe,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Search,
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
import {
  deleteJob,
  getAdminJob,
  listAllJobs,
  reviewJob,
} from "@/lib/admin-jobs";
import {
  formatJobDate,
  formatPay,
  type AdminJob,
  type AdminJobSummary,
  type JobCounts,
  type JobStatus,
} from "@/lib/jobs";

const PAGE_SIZE = 25;

const TABS: {
  status: JobStatus;
  labelKey: string;
  countKey: keyof JobCounts;
}[] = [
  { status: "PENDING", labelKey: "pending", countKey: "pending" },
  { status: "APPROVED", labelKey: "live", countKey: "approved" },
  { status: "REJECTED", labelKey: "rejectedSection", countKey: "rejected" },
];

/**
 * The moderation queue. Opens on what needs a decision, and filters, searches
 * and pages in the database rather than holding the whole board in the browser.
 */
export function JobsManager() {
  const t = useTranslations("jobs");
  const a = useTranslations("admin");
  const s = useTranslations("states");
  const locale = useLocale();

  const [tab, setTab] = useState<JobStatus>("PENDING");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const [jobs, setJobs] = useState<AdminJobSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [counts, setCounts] = useState<JobCounts>({
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [rejecting, setRejecting] = useState<AdminJobSummary | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [confirming, setConfirming] = useState<AdminJobSummary | null>(null);
  const [detailsId, setDetailsId] = useState<string | null>(null);
  // Captured on load rather than during render, so "expired" is a stable
  // value and rendering a row stays pure.
  const [now, setNow] = useState(0);

  const load = useCallback(async () => {
    try {
      const data = await listAllJobs({
        status: tab,
        q: query || undefined,
        page,
        pageSize: PAGE_SIZE,
      });
      setJobs(data.jobs);
      setNow(Date.now());
      setTotal(data.total);
      setCounts(data.counts);
      setError(null);
    } catch (err) {
      setError(toApiError(err).error);
    } finally {
      setLoading(false);
    }
  }, [tab, query, page]);

  useEffect(() => {
    void load();
  }, [load]);

  // Debounced, so typing does not fire a request per keystroke.
  useEffect(() => {
    const id = setTimeout(() => {
      setQuery(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(id);
  }, [search]);

  async function review(
    job: AdminJobSummary,
    status: "APPROVED" | "REJECTED",
    reason?: string,
  ) {
    setBusyId(job.id);
    setNotice(null);
    try {
      await reviewJob(job.id, status, reason);
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

  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, total);

  return (
    <div className="flex flex-col gap-5">
      {/* Tabs — the queue leads, because it is the only one needing action. */}
      <div className="flex flex-wrap items-center gap-1 border-b border-border">
        {TABS.map((item) => {
          const active = tab === item.status;
          return (
            <button
              key={item.status}
              type="button"
              onClick={() => {
                setTab(item.status);
                setPage(1);
              }}
              aria-current={active ? "page" : undefined}
              className={`-mb-px flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm transition-colors ${
                active
                  ? "border-bd-green font-medium text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.status === "PENDING" && counts.pending > 0 && (
                <span aria-hidden className="size-2 rounded-full bg-marigold" />
              )}
              {t(item.labelKey)}
              <Badge variant={active ? "default" : "secondary"}>
                {counts[item.countKey]}
              </Badge>
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search
            className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("searchPlaceholder")}
            aria-label={t("searchPlaceholder")}
            className={`${inputClass(false)} pl-9`}
          />
        </div>
        {total > 0 && (
          <p className="text-sm text-muted-foreground">
            {t("showing", { from, to, total })}
          </p>
        )}
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

      {loading ? (
        <p
          role="status"
          aria-live="polite"
          className="flex items-center gap-2 text-muted-foreground"
        >
          <Loader2 className="size-4 animate-spin" aria-hidden />
          {s("loading")}
        </p>
      ) : jobs.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border px-6 py-12 text-center text-muted-foreground">
          {query
            ? t("noResults")
            : tab === "PENDING"
              ? t("noPending")
              : t("noJobs")}
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {jobs.map((job) => (
            <JobRow
              key={job.id}
              job={job}
              now={now}
              busy={busyId === job.id}
              onApprove={() => review(job, "APPROVED")}
              onReject={() => {
                setRejectReason("");
                setRejecting(job);
              }}
              onDelete={() => setConfirming(job)}
              onDetails={() => setDetailsId(job.id)}
            />
          ))}
        </ul>
      )}

      {pages > 1 && (
        <div className="flex items-center justify-between gap-3">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            {t("prevPage")}
          </Button>
          <span className="text-sm text-muted-foreground">
            {t("pageOf", { page, pages })}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= pages}
            onClick={() => setPage((p) => Math.min(pages, p + 1))}
          >
            {t("nextPage")}
          </Button>
        </div>
      )}

      <JobDetailsDialog
        jobId={detailsId}
        locale={locale}
        onClose={() => setDetailsId(null)}
      />

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
              onClick={() =>
                rejecting && review(rejecting, "REJECTED", rejectReason)
              }
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

/** One compact row. Everything long lives behind Details. */
function JobRow({
  job,
  now,
  busy,
  onApprove,
  onReject,
  onDelete,
  onDetails,
}: {
  job: AdminJobSummary;
  now: number;
  busy: boolean;
  onApprove: () => void;
  onReject: () => void;
  onDelete: () => void;
  onDetails: () => void;
}) {
  const t = useTranslations("jobs");
  const pay = formatPay(job.payCents, job.payUnit, {
    perHour: t("perHour"),
    perMonth: t("perMonth"),
  });
  const expired =
    job.deadline !== null && new Date(job.deadline).getTime() < now;

  return (
    <li
      className={`flex flex-col gap-3 rounded-xl border bg-card p-4 lg:flex-row lg:items-center lg:justify-between ${
        job.status === "PENDING" ? "border-marigold/50" : "border-border"
      }`}
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">{t(`type${job.type}`)}</Badge>
          {job.remote && <Badge variant="secondary">{t("remote")}</Badge>}
          {expired && <Badge variant="secondary">{t("expired")}</Badge>}
        </div>
        <h3 className="mt-1.5 font-display text-base leading-tight font-semibold text-foreground">
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
          <span className="text-xs">
            {t("submittedBy")}: {job.submitterName}
          </span>
        </p>
        {job.rejectionReason && (
          <p className="mt-2 rounded-lg bg-destructive/10 px-3 py-1.5 text-sm text-destructive">
            {job.rejectionReason}
          </p>
        )}
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-2">
        {job.status === "PENDING" && (
          <>
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
          </>
        )}
        <Button size="sm" variant="outline" onClick={onDetails}>
          <FileText aria-hidden />
          {t("details")}
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={onDelete}
          disabled={busy}
        >
          <Trash2 aria-hidden />
          {t("deleteJob")}
        </Button>
      </div>
    </li>
  );
}

/** Loads the full record only when opened, since the list omits the bodies. */
function JobDetailsDialog({
  jobId,
  locale,
  onClose,
}: {
  jobId: string | null;
  locale: string;
  onClose: () => void;
}) {
  const t = useTranslations("jobs");
  const [job, setJob] = useState<AdminJob | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!jobId) return;
    let cancelled = false;
    setJob(null);
    setError(null);
    getAdminJob(jobId)
      .then((full) => !cancelled && setJob(full))
      .catch((err) => !cancelled && setError(toApiError(err).error));
    return () => {
      cancelled = true;
    };
  }, [jobId]);

  return (
    <Dialog open={jobId !== null} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-lg">
            {job?.title ?? t("details")}
          </DialogTitle>
          {job && (
            <DialogDescription>
              {job.company} ·{" "}
              {t("detailsOf", { date: formatJobDate(job.createdAt, locale) })}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="flex max-h-[65vh] flex-col gap-4 overflow-y-auto px-1 text-sm">
          {error ? (
            <p role="alert" className="text-destructive">
              {error}
            </p>
          ) : !job ? (
            <p className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="size-4 animate-spin" aria-hidden />
              {t("loadingDetails")}
            </p>
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-1 rounded-xl bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">
                  {t("submittedBy")}:
                </span>
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

              <Block title={t("aboutCompany")} body={job.aboutCompany} />
              <Block title={t("tasks")} body={job.tasks} />
              <Block title={t("profileLabel")} body={job.profile} />
              {job.offer && <Block title={t("offer")} body={job.offer} />}

              <dl className="grid gap-x-6 gap-y-1 text-muted-foreground sm:grid-cols-2">
                <Row
                  label={t("startsLabel")}
                  value={
                    job.startDate
                      ? formatJobDate(job.startDate, locale)
                      : t("asap")
                  }
                />
                <Row
                  label={t("untilLabel")}
                  value={
                    job.until
                      ? formatJobDate(job.until, locale)
                      : t("openEnded")
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
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
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
