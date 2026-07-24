import { setRequestLocale, getTranslations } from "next-intl/server";
import { HeroCarousel } from "@/components/panels/hero-carousel";
import { About } from "@/components/panels/about";
import { WhatWeDo } from "@/components/panels/what-we-do";
import { Events } from "@/components/panels/events";
import { Stats } from "@/components/panels/stats";
import { Support } from "@/components/panels/support";
import { Join } from "@/components/panels/join";
import { MotifStrip } from "@/components/motifs/motif-strip";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("home");
  const sl = await getTranslations("slides");
  const a = await getTranslations("about");
  const d = await getTranslations("doing");
  const e = await getTranslations("events");
  const s = await getTranslations("support");
  const st = await getTranslations("stats");
  const j = await getTranslations("join");

  return (
    <div id="top">
      <HeroCarousel
        slides={[
          { title: sl("s1Title"), text: sl("s1Text") },
          { title: sl("s2Title"), text: sl("s2Text") },
          { title: sl("s3Title"), text: sl("s3Text") },
          { title: sl("s4Title"), text: sl("s4Text") },
        ]}
        ctaPrimary={j("cta")}
        ctaSecondary={e("cta")}
      />

      <MotifStrip />

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
          {
            title: d("cultureTitle"),
            body: d("cultureBody"),
            icon: "flower",
            accent: "text-madder",
          },
          {
            title: d("supportTitle"),
            body: d("supportBody"),
            icon: "star",
            accent: "text-brand-blue",
          },
          {
            title: d("communityTitle"),
            body: d("communityBody"),
            icon: "leaf",
            accent: "text-bd-green",
          },
          {
            title: d("eventsTitle"),
            body: d("eventsBody"),
            icon: "paisley",
            accent: "text-marigold",
          },
        ]}
      />

      <MotifStrip />

      <Events
        title={e("title")}
        subtitle={e("subtitle")}
        cta={e("cta")}
        items={[
          {
            title: e("e1Title"),
            date: e("e1Date"),
            place: e("e1Place"),
            accent: "text-bd-green",
          },
          {
            title: e("e2Title"),
            date: e("e2Date"),
            place: e("e2Place"),
            accent: "text-madder",
          },
          {
            title: e("e3Title"),
            date: e("e3Date"),
            place: e("e3Place"),
            accent: "text-indigo",
          },
        ]}
      />

      <Stats
        items={[
          { value: st("membersValue"), label: st("membersLabel") },
          { value: st("sinceValue"), label: st("sinceLabel") },
          { value: st("eventsValue"), label: st("eventsLabel") },
        ]}
      />

      <Support
        title={s("title")}
        subtitle={s("subtitle")}
        items={[s("i1"), s("i2"), s("i3"), s("i4")]}
      />

      <Join title={j("title")} body={j("body")} cta={j("cta")} />
    </div>
  );
}
