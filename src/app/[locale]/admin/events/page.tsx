import { setRequestLocale } from "next-intl/server";
import { EventsManager } from "@/components/admin/events-manager";

export default async function AdminEventsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <EventsManager />;
}
