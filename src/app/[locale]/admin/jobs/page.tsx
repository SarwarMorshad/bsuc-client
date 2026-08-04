import { setRequestLocale, getTranslations } from "next-intl/server";
import { AdminShell } from "@/components/admin/admin-shell";
import { JobsManager } from "@/components/admin/jobs-manager";

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
      <JobsManager />
    </AdminShell>
  );
}
