import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/layout/page-header";
import { Join } from "@/components/panels/join";

export default async function JoinPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const p = await getTranslations("pages");
  const j = await getTranslations("join");

  return (
    <>
      <PageHeader title={p("joinTitle")} subtitle={p("joinSubtitle")} />
      <Join title={j("title")} body={j("body")} cta={j("cta")} />
    </>
  );
}
