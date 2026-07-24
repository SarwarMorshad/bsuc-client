import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/layout/page-header";
import { Support } from "@/components/panels/support";

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
