import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/layout/page-header";
import { Support } from "@/components/panels/support";
import { buildMetadata } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const p = await getTranslations({ locale, namespace: "pages" });
  return buildMetadata({
    locale,
    path: "/new-students",
    title: p("newStudentsTitle"),
    description: p("newStudentsSubtitle"),
  });
}

export default async function NewStudentsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const p = await getTranslations("pages");
  const s = await getTranslations("support");

  return (
    <>
      <PageHeader
        title={p("newStudentsTitle")}
        subtitle={p("newStudentsSubtitle")}
      />
      <Support
        title={s("title")}
        subtitle={s("subtitle")}
        items={[s("i1"), s("i2"), s("i3"), s("i4")]}
      />
    </>
  );
}
