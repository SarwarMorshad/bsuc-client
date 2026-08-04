import { api } from "@/lib/api";
import type { AdminJob, Job, JobCounts } from "@/lib/jobs";

/** Approved, unexpired listings. Members only — the API enforces it. */
export async function listJobs(): Promise<Job[]> {
  const { data } = await api.get<{ jobs: Job[] }>("/jobs");
  return data.jobs;
}

/** Every listing including submitter details. Admin only. */
export async function listAllJobs(): Promise<{
  jobs: AdminJob[];
  counts: JobCounts;
}> {
  const { data } = await api.get<{ jobs: AdminJob[]; counts: JobCounts }>(
    "/jobs/all",
  );
  return data;
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
