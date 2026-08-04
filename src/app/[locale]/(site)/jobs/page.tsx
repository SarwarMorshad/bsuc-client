import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/layout/page-header";
import { Jobs } from "@/components/panels/jobs";
import { buildMetadata } from "@/lib/metadata";
import { redirect } from "@/i18n/navigation";
import { getServerUser } from "@/lib/server-auth";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const p = await getTranslations({ locale, namespace: "pages" });
  return buildMetadata({
    locale,
    path: "/jobs",
    title: p("jobsTitle"),
    description: p("jobsSubtitle"),
  });
}

export default async function JobsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Members only: the listings are for our community, not the open web.
  const user = await getServerUser();
  if (!user) redirect({ href: "/login", locale });

  const p = await getTranslations("pages");

  return (
    <>
      <PageHeader title={p("jobsTitle")} subtitle={p("jobsSubtitle")} />
      <Jobs />
    </>
  );
}
