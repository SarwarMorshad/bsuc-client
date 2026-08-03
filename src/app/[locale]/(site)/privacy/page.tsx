import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { buildMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/layout/page-header";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacy" });
  return buildMetadata({
    locale,
    path: "/privacy",
    title: t("title"),
    description: t("subtitle"),
  });
}

const SECTIONS = ["s1", "s2", "s3", "s4", "s5", "s6"] as const;

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("privacy");

  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />

      <section className="mx-auto max-w-2xl px-6 py-14 sm:py-16">
        <p className="rounded-lg border border-dashed border-marigold/60 bg-marigold/10 px-4 py-3 text-sm text-foreground">
          {t("draft")}
        </p>

        <div className="mt-10 flex flex-col gap-8">
          {SECTIONS.map((s) => (
            <div key={s} className="flex flex-col gap-2">
              <h2 className="font-display text-xl font-semibold text-foreground">
                {t(`${s}t`)}
              </h2>
              <p className="leading-relaxed text-muted-foreground">{t(`${s}b`)}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
