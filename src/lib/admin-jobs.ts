import { api } from "@/lib/api";
import type {
  AdminJob,
  AdminJobSummary,
  Job,
  JobCounts,
  JobStatus,
} from "@/lib/jobs";

/** Approved, unexpired listings. Members only — the API enforces it. */
export async function listJobs(): Promise<Job[]> {
  const { data } = await api.get<{ jobs: Job[] }>("/jobs");
  return data.jobs;
}

export type AdminJobQuery = {
  status?: JobStatus;
  q?: string;
  page?: number;
  pageSize?: number;
};

export type AdminJobPage = {
  jobs: AdminJobSummary[];
  total: number;
  page: number;
  pageSize: number;
  counts: JobCounts;
};

/**
 * One page of the moderation queue. Filtering, searching and paging all happen
 * in the database, so the browser never holds the whole board.
 */
export async function listAllJobs(
  params: AdminJobQuery = {},
): Promise<AdminJobPage> {
  const { data } = await api.get<AdminJobPage>("/jobs/all", { params });
  return data;
}

/** The full record, including the advert text the list omits. */
export async function getAdminJob(id: string): Promise<AdminJob> {
  const { data } = await api.get<{ job: AdminJob }>(`/jobs/${id}`);
  return data.job;
}

export async function reviewJob(
  id: string,
  status: "APPROVED" | "REJECTED",
  rejectionReason?: string,
): Promise<AdminJob> {
  const { data } = await api.patch<{ job: AdminJob }>(`/jobs/${id}/review`, {
    status,
    rejectionReason: rejectionReason || null,
  });
  return data.job;
}

export async function deleteJob(id: string): Promise<void> {
  await api.delete(`/jobs/${id}`);
}
