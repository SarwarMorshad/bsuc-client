import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/layout/page-header";
import { Gallery } from "@/components/panels/gallery";

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const p = await getTranslations("pages");
  const g = await getTranslations("gallery");

  return (
    <>
      <PageHeader title={p("galleryTitle")} subtitle={p("gallerySubtitle")} />
      <Gallery note={g("note")} />
    </>
  );
}
