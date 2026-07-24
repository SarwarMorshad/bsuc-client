import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/layout/page-header";
import { Events } from "@/components/panels/events";

export default async function EventsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const p = await getTranslations("pages");
  const e = await getTranslations("events");

  return (
    <>
      <PageHeader title={p("eventsTitle")} subtitle={p("eventsSubtitle")} />
      <Events
        title={e("title")}
        subtitle={e("subtitle")}
        cta={e("cta")}
        items={[
          { title: e("e1Title"), date: e("e1Date"), place: e("e1Place"), accent: "text-bd-green" },
          { title: e("e2Title"), date: e("e2Date"), place: e("e2Place"), accent: "text-madder" },
          { title: e("e3Title"), date: e("e3Date"), place: e("e3Place"), accent: "text-indigo" },
        ]}
      />
    </>
  );
}
