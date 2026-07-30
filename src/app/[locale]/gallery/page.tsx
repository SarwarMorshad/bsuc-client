import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/layout/page-header";
import { Gallery } from "@/components/panels/gallery";
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
    path: "/gallery",
    title: p("galleryTitle"),
    description: p("gallerySubtitle"),
  });
}

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
