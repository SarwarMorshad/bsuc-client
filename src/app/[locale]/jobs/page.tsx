import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/layout/page-header";
import { Jobs } from "@/components/panels/jobs";

export default async function JobsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const p = await getTranslations("pages");
  const j = await getTranslations("jobs");
  const n = await getTranslations("nav");

  return (
    <>
      <PageHeader title={p("jobsTitle")} subtitle={p("jobsSubtitle")} />
      <Jobs
        note={j("note")}
        joinCta={n("join")}
        categories={[
          { label: j("cat1"), icon: "star", accent: "text-brand-blue" },
          { label: j("cat2"), icon: "leaf", accent: "text-bd-green" },
          { label: j("cat3"), icon: "paisley", accent: "text-indigo" },
          { label: j("cat4"), icon: "flower", accent: "text-madder" },
        ]}
      />
    </>
  );
}
