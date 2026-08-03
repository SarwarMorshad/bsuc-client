import { setRequestLocale, getTranslations } from "next-intl/server";
import { AdminShell } from "@/components/admin/admin-shell";

/** Placeholder until the jobs feature is built. */
export default async function AdminJobsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin");

  return (
    <AdminShell title={t("jobs")}>
      <p className="rounded-xl border border-dashed border-border px-6 py-10 text-center text-muted-foreground">
        {t("jobsComingSoon")}
      </p>
    </AdminShell>
  );
}
