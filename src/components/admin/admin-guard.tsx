"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useAuth } from "@/components/auth/auth-provider";

/**
 * Gates the admin area in the UI. The route guard in proxy.ts only checks that
 * a session exists, so the role is checked here — and, crucially, again on
 * every admin endpoint, which is what actually protects the data.
 */
export function AdminGuard({ children }: { children: React.ReactNode }) {
  const t = useTranslations("admin");
  const s = useTranslations("states");
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <p role="status" aria-live="polite" className="text-muted-foreground">
        {s("loading")}
      </p>
    );
  }

  if (user?.role !== "ADMIN") {
    return (
      <div className="flex flex-col items-start gap-4">
        <h1 className="font-display text-3xl font-semibold text-foreground">
          {t("noAccessTitle")}
        </h1>
        <p className="max-w-md text-muted-foreground">{t("noAccessBody")}</p>
        <Link
          href="/"
          className="rounded-full bg-bd-green px-6 py-2.5 text-sm font-medium text-cream"
        >
          {t("backHome")}
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
