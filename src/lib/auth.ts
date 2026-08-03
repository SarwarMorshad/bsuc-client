import { api } from "@/lib/api";

export type DegreeLevel = "BACHELOR" | "MASTER" | "PHD" | "OTHER";

/** The authenticated member, as returned by the API. */
export type User = {
  id: string;
  name: string;
  email: string;
  matriculationNumber: string;
  program: string | null;
  countryRegion: string | null;
  year: number | null;
  phone: string | null;
  degreeLevel: DegreeLevel | null;
  arrivalYear: number | null;
  bio: string | null;
  /** Address awaiting confirmation during an email change. */
  pendingEmail: string | null;
  role: "MEMBER" | "ADMIN";
  avatarUrl: string | null;
  /** Timestamp of email confirmation, or null while still pending. */
  emailVerified: string | null;
  createdAt: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  matriculationNumber: string;
  password: string;
  program?: string;
};

export async function register(payload: RegisterPayload): Promise<User> {
  const { data } = await api.post<{ user: User }>("/auth/register", payload);
  return data.user;
}

export type UpdateProfilePayload = {
  name?: string;
  program?: string | null;
  countryRegion?: string | null;
  year?: number | null;
  phone?: string | null;
  degreeLevel?: DegreeLevel | null;
  arrivalYear?: number | null;
  bio?: string | null;
};

/** Updates the signed-in member's own details. */
export async function updateProfile(
  payload: UpdateProfilePayload,
): Promise<User> {
  const { data } = await api.patch<{ user: User }>("/profile", payload);
  return data.user;
}

export async function changePassword(
  currentPassword: string,
  newPassword: string,
): Promise<void> {
  await api.post("/profile/password", { currentPassword, newPassword });
}

/** Starts an email change; the new address must confirm before it applies. */
export async function requestEmailChange(
  newEmail: string,
  password: string,
): Promise<void> {
  await api.post("/profile/email", { newEmail, password });
}

/** Permanently deletes the signed-in member's account. */
export async function deleteAccount(password: string): Promise<void> {
  await api.delete("/profile", { data: { password } });
}

/** Confirms an email address using the token from the verification link. */
export async function verifyEmail(token: string): Promise<void> {
  await api.post("/auth/verify", { token });
}

/** Requests a new verification link. Always resolves, even for unknown emails. */
export async function resendVerification(email: string): Promise<void> {
  await api.post("/auth/resend-verification", { email });
}

export async function login(email: string, password: string): Promise<User> {
  const { data } = await api.post<{ user: User }>("/auth/login", {
    email,
    password,
  });
  return data.user;
}

export async function logout(): Promise<void> {
  await api.post("/auth/logout");
}

/** Returns the current user, or null when there is no valid session. */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data } = await api.get<{ user: User }>("/auth/me");
    return data.user;
  } catch {
    return null;
  }
}
