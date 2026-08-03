import { setRequestLocale, getTranslations } from "next-intl/server";
import { AdminShell } from "@/components/admin/admin-shell";
import { EventsManager } from "@/components/admin/events-manager";

export default async function AdminEventsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin");

  return (
    <AdminShell title={t("events")}>
      <EventsManager />
    </AdminShell>
  );
}
