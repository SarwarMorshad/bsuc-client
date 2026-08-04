export type JobType =
  | "HIWI"
  | "WERKSTUDENT"
  | "INTERNSHIP"
  | "MINIJOB"
  | "PART_TIME"
  | "THESIS"
  | "DUAL_STUDY"
  | "ENTRY_LEVEL"
  | "TRAINEE"
  | "FULL_TIME"
  | "PHD"
  | "FREELANCE";
export type JobStatus = "PENDING" | "APPROVED" | "REJECTED";
export type PayUnit = "HOUR" | "MONTH";
export type GermanLevel =
  "ENGLISH_OK" | "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

/** A listing as members see it — no submitter details. */
export type Job = {
  id: string;
  title: string;
  company: string;
  companyWebsite: string | null;
  location: string | null;
  remote: boolean;
  type: JobType;
  /** ISO timestamps. */
  startDate: string | null;
  until: string | null;
  hoursPerWeek: number | null;
  /** Pay in cents, so the arithmetic stays exact. */
  payCents: number | null;
  payUnit: PayUnit;
  payNote: string | null;
  aboutCompany: string;
  tasks: string;
  profile: string;
  offer: string | null;
  germanLevel: GermanLevel | null;
  contactName: string | null;
  applyEmail: string | null;
  applyUrl: string | null;
  deadline: string | null;
  createdAt: string;
};

/** Moderation fields shared by the list row and the full record. */
type AdminFields = {
  status: JobStatus;
  rejectionReason: string | null;
  reviewedAt: string | null;
  submitterName: string;
  submitterEmail: string;
  submitterPhone: string | null;
};

/**
 * A row in the moderation list. The four advert bodies are absent on purpose —
 * they are fetched per listing when the details modal opens.
 */
export type AdminJobSummary = Omit<
  Job,
  | "aboutCompany"
  | "tasks"
  | "profile"
  | "offer"
  | "startDate"
  | "until"
  | "contactName"
  | "applyEmail"
  | "applyUrl"
> &
  AdminFields;

/** One listing in full, for the details modal. */
export type AdminJob = Job &
  AdminFields & { reviewedById: string | null; updatedAt: string };

export type JobCounts = {
  pending: number;
  approved: number;
  rejected: number;
};

/** Formats pay the German way: 13,90 € pro Stunde. */
export function formatPay(
  payCents: number | null,
  unit: PayUnit,
  labels: { perHour: string; perMonth: string },
) {
  if (payCents == null) return null;
  const amount = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(payCents / 100);
  return `${amount} ${unit === "HOUR" ? labels.perHour : labels.perMonth}`;
}

/** Short date, e.g. 15.10.2026. */
export function formatJobDate(iso: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(iso));
}
