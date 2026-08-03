import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/layout/page-header";
import { Events } from "@/components/panels/events";
import { buildMetadata } from "@/lib/metadata";
import { getPublicEvents } from "@/lib/events";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const p = await getTranslations({ locale, namespace: "pages" });
  return buildMetadata({
    locale,
    path: "/events",
    title: p("eventsTitle"),
    description: p("eventsSubtitle"),
  });
}

export default async function EventsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const p = await getTranslations("pages");
  const e = await getTranslations("events");

  const events = await getPublicEvents();

  return (
    <>
      <PageHeader title={p("eventsTitle")} subtitle={p("eventsSubtitle")} />
      <Events
        title={e("title")}
        subtitle={e("subtitle")}
        emptyMessage={e("empty")}
        events={events}
        locale={locale}
      />
    </>
  );
}
