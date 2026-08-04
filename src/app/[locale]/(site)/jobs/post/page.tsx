import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/layout/page-header";
import { JobSubmissionForm } from "@/components/panels/job-submission-form";
import { buildMetadata } from "@/lib/metadata";

/**
 * Public, unlike the rest of /jobs — this is the page employers use, and
 * asking them to register first is the friction the whole design avoids.
 * The exception is declared in proxy.ts.
 *
 * German throughout: the audience is employers writing a German advert.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    locale,
    path: "/jobs/post",
    title: "Stellenanzeige aufgeben",
    description:
      "Veröffentlichen Sie eine Stelle für Studierende der TU Chemnitz. Jede Anzeige wird vor der Veröffentlichung geprüft.",
  });
}

export default async function PostJobPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <PageHeader
        title="Stellenanzeige aufgeben"
        subtitle="Erreichen Sie Studierende der TU Chemnitz. Kostenlos, und jede Anzeige wird von uns geprüft."
      />
      <section className="px-6 py-12 sm:py-16">
        <JobSubmissionForm />
      </section>
    </>
  );
}
