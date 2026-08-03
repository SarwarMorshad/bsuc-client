"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { getStats, type AdminStats } from "@/lib/admin";
import { toApiError } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";

function Stat({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string;
  value: number;
  hint?: string;
  tone?: "default" | "warn" | "good";
}) {
  const toneClass =
    tone === "warn"
      ? "text-marigold"
      : tone === "good"
        ? "text-bd-green"
        : "text-foreground";

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className={`font-display text-3xl font-semibold ${toneClass}`}>{value}</p>
        {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      </CardContent>
    </Card>
  );
}

export function DashboardOverview() {
  const t = useTranslations("admin");
  const s = useTranslations("states");
  const locale = useLocale();

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getStats()
      .then(setStats)
      .catch((err) => setError(toApiError(err).error));
  }, []);

  if (error) {
    return (
      <p role="alert" className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
        {error}
      </p>
    );
  }

  if (!stats) {
    return (
      <p role="status" aria-live="polite" className="text-muted-foreground">
        {s("loading")}
      </p>
    );
  }

  const fmt = new Intl.DateTimeFormat(locale, { day: "numeric", month: "short" });

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Stat label={t("statMembers")} value={stats.members.total} />
        <Stat label={t("statAdmins")} value={stats.members.admins} tone="good" />
        <Stat
          label={t("statUnverified")}
          value={stats.members.unverified}
          tone={stats.members.unverified > 0 ? "warn" : "default"}
        />
        <Stat label={t("statUpcoming")} value={stats.events.upcoming} />
        <Stat
          label={t("statDrafts")}
          value={stats.events.drafts}
          tone={stats.events.drafts > 0 ? "warn" : "default"}
        />
        <Stat label={t("statJobs")} value={stats.jobs.total} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Recent sign-ups */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-display text-base">
              {t("recentMembers")}
            </CardTitle>
            <Link
              href="/admin/members"
              className={buttonVariants({ variant: "ghost", size: "sm" })}
            >
              {t("viewAll")}
            </Link>
          </CardHeader>
          <CardContent>
            {stats.recentMembers.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t("noMembers")}</p>
            ) : (
              <ul className="flex flex-col gap-3">
                {stats.recentMembers.map((m) => (
                  <li key={m.id} className="flex items-center gap-3">
                    {m.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={m.avatarUrl}
                        alt=""
                        className="h-8 w-8 shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                        {m.name.slice(0, 1).toUpperCase()}
                      </span>
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm text-foreground">
                        {m.name}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {m.email}
                      </span>
                    </span>
                    {m.role === "ADMIN" && (
                      <Badge variant="secondary">{t("statAdmins")}</Badge>
                    )}
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {fmt.format(new Date(m.createdAt))}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Quick actions */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-base">
              {t("quickActions")}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Link href="/admin/events" className={buttonVariants()}>
              {t("newEvent")}
            </Link>
            <Link
              href="/admin/members"
              className={buttonVariants({ variant: "outline" })}
            >
              {t("members")}
            </Link>
            <Link href="/events" className={buttonVariants({ variant: "ghost" })}>
              {t("viewAll")}
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
