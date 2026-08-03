import { api } from "@/lib/api";
import type { User } from "@/lib/auth";

export type AdminStats = {
  members: { total: number; admins: number; unverified: number };
  events: { total: number; published: number; drafts: number; upcoming: number };
  jobs: { total: number; published: number };
  recentMembers: User[];
};

export async function getStats(): Promise<AdminStats> {
  const { data } = await api.get<AdminStats>("/admin/stats");
  return data;
}

export async function listMembers(search?: string): Promise<User[]> {
  const { data } = await api.get<{ members: User[] }>("/admin/members", {
    params: search ? { search } : undefined,
  });
  return data.members;
}

export async function setMemberRole(
  id: string,
  role: "MEMBER" | "ADMIN",
): Promise<User> {
  const { data } = await api.patch<{ member: User }>(
    `/admin/members/${id}/role`,
    { role },
  );
  return data.member;
}
