import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/layout/page-header";
import { JobSubmissionForm } from "@/components/panels/job-submission-form";
import { buildMetadata } from "@/lib/metadata";

/**
 * Public, unlike the rest of /jobs — this is the page employers use, and
 * asking them to register first is the friction the whole design avoids.
 * The exception is declared in proxy.ts.
 *
 * The interface follows the site language; the advert itself must still be
 * written in German, which the form states.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "postJob" });
  return buildMetadata({
    locale,
    path: "/jobs/post",
    title: t("pageTitle"),
    description: t("pageSubtitle"),
  });
}

export default async function PostJobPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("postJob");

  return (
    <>
      <PageHeader title={t("pageTitle")} subtitle={t("pageSubtitle")} />
      <section className="px-6 py-12 sm:py-16">
        <JobSubmissionForm />
      </section>
    </>
  );
}
