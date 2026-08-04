import { cookies } from "next/headers";
import type { User } from "@/lib/auth";

const AUTH_COOKIE = "bsuc_token";

/**
 * Resolves the signed-in user on the server, before anything renders.
 *
 * The API is asked rather than the token decoded here: it verifies the
 * signature and reads the current role from the database, so a tampered
 * cookie or a role changed since sign-in is handled in one place. Never
 * cached — the answer is per-request.
 *
 * Returns null when there is no session, or when the API cannot be reached;
 * callers should treat null as "not signed in".
 */
export async function getServerUser(): Promise<User | null> {
  const token = (await cookies()).get(AUTH_COOKIE)?.value;
  if (!token) return null;

  const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

  try {
    const res = await fetch(`${base}/auth/me`, {
      headers: { Cookie: `${AUTH_COOKIE}=${token}` },
      cache: "no-store",
    });
    if (!res.ok) return null;

    const data = (await res.json()) as { user: User };
    return data.user ?? null;
  } catch {
    return null;
  }
}
