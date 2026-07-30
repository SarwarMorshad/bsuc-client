import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/layout/page-header";
import { Contact } from "@/components/panels/contact";
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
    path: "/contact",
    title: p("contactTitle"),
    description: p("contactSubtitle"),
  });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const p = await getTranslations("pages");
  const c = await getTranslations("contact");

  return (
    <>
      <PageHeader title={p("contactTitle")} subtitle={p("contactSubtitle")} />
      <Contact
        emailLabel={c("emailLabel")}
        socialLabel={c("socialLabel")}
        addressLabel={c("addressLabel")}
        address={c("address")}
      />
    </>
  );
}
