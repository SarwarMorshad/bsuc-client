import { api } from "@/lib/api";

export type JobSubmission = {
  title: string;
  company: string;
  companyWebsite?: string | null;
  location?: string | null;
  remote?: boolean;
  type: "HIWI" | "WERKSTUDENT" | "INTERNSHIP" | "PART_TIME";
  startDate?: string | null;
  until?: string | null;
  hoursPerWeek?: number | null;
  payCents?: number | null;
  payUnit: "HOUR" | "MONTH";
  payNote?: string | null;
  aboutCompany: string;
  tasks: string;
  profile: string;
  offer?: string | null;
  germanLevel?: string | null;
  contactName?: string | null;
  applyEmail?: string | null;
  applyUrl?: string | null;
  deadline?: string | null;
  submitterName: string;
  submitterEmail: string;
  submitterPhone?: string | null;
  /** Honeypot. Must stay empty; a real person never sees this field. */
  website2?: string;
};

/**
 * Sends a listing for review. No authentication — employers are not asked to
 * register. The API stores it as PENDING, so nothing appears until approved.
 */
export async function submitJob(
  input: JobSubmission,
): Promise<{ id: string | null; status: string }> {
  const { data } = await api.post<{ id: string | null; status: string }>(
    "/jobs/submit",
    input,
  );
  return data;
}

/** "16,50" or "16.50" -> 1650. German keyboards produce the comma. */
export function euroToCents(value: string): number | null {
  const normalised = value.trim().replace(/\s/g, "").replace(",", ".");
  if (normalised === "") return null;
  const amount = Number(normalised);
  if (!Number.isFinite(amount) || amount < 0) return null;
  return Math.round(amount * 100);
}
