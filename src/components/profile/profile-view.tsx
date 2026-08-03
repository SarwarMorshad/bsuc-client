"use client";

import { useLocale, useTranslations } from "next-intl";
import { useAuth } from "@/components/auth/auth-provider";
import { ProfileDetails } from "@/components/profile/profile-details";
import { ChangePassword } from "@/components/profile/change-password";
import { RunningStitch } from "@/components/motifs/running-stitch";

/**
 * The member's own profile. The page is already gated by the route guard, so
 * this only needs to wait for the session to resolve.
 */
export function ProfileView() {
  const t = useTranslations("profile");
  const s = useTranslations("states");
  const locale = useLocale();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <p role="status" aria-live="polite" className="text-muted-foreground">
        {s("loading")}
      </p>
    );
  }

  if (!user) return null;

  const initials = user.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

  const memberSince = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
  }).format(new Date(user.createdAt));

  return (
    <div className="flex flex-col gap-8">
      {/* Summary */}
      <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-center sm:gap-6 sm:text-left">
        {/* Placeholder avatar — real uploads land with Cloudinary later */}
        <span
          className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-bd-green font-display text-2xl font-semibold text-cream"
          aria-hidden="true"
        >
          {initials}
        </span>

        <div className="flex flex-col gap-1.5">
          <h1 className="font-display text-3xl font-semibold text-foreground">
            {user.name}
          </h1>
          <RunningStitch className="w-20 text-madder" />
          <p className="text-sm text-muted-foreground">{user.email}</p>
          <div className="mt-1 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            <span className="rounded-full bg-indigo/10 px-3 py-1 text-xs font-medium text-indigo">
              {t("roleLabel")}: {user.role}
            </span>
            {user.emailVerified && (
              <span className="inline-flex items-center gap-1 rounded-full bg-bd-green/15 px-3 py-1 text-xs font-medium text-bd-green">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                {t("verified")}
              </span>
            )}
            <span className="rounded-full bg-muted/30 px-3 py-1 text-xs text-muted-foreground">
              {t("memberSince")} {memberSince}
            </span>
          </div>
        </div>
      </div>

      <ProfileDetails />
      <ChangePassword />
    </div>
  );
}
