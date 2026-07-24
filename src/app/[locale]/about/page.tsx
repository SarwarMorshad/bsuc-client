import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/layout/page-header";
import { About } from "@/components/panels/about";
import { WhatWeDo } from "@/components/panels/what-we-do";
import { MotifStrip } from "@/components/motifs/motif-strip";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const p = await getTranslations("pages");
  const a = await getTranslations("about");
  const d = await getTranslations("doing");

  return (
    <>
      <PageHeader title={p("aboutTitle")} subtitle={p("aboutSubtitle")} />
      <About
        eyebrow={a("eyebrow")}
        title={a("title")}
        lead={a("lead")}
        body={a("body")}
        imageCaption={a("imageCaption")}
        points={[
          { title: a("p1Title"), text: a("p1Text"), icon: "leaf", accent: "text-bd-green" },
          { title: a("p2Title"), text: a("p2Text"), icon: "flower", accent: "text-madder" },
          { title: a("p3Title"), text: a("p3Text"), icon: "star", accent: "text-brand-blue" },
        ]}
      />
      <MotifStrip />
      <WhatWeDo
        title={d("title")}
        subtitle={d("subtitle")}
        items={[
          { title: d("cultureTitle"), body: d("cultureBody"), icon: "flower", accent: "text-madder" },
          { title: d("supportTitle"), body: d("supportBody"), icon: "star", accent: "text-brand-blue" },
          { title: d("communityTitle"), body: d("communityBody"), icon: "leaf", accent: "text-bd-green" },
          { title: d("eventsTitle"), body: d("eventsBody"), icon: "paisley", accent: "text-marigold" },
        ]}
      />
    </>
  );
}
