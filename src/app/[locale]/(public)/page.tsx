import { setRequestLocale, getTranslations } from "next-intl/server";
import { HeroCarousel } from "@/components/panels/hero-carousel";
import { HomeIntro } from "@/components/panels/home-intro";
import { Stats } from "@/components/panels/stats";
import { Highlights } from "@/components/panels/highlights";
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
  const st = await getTranslations("stats");
  const n = await getTranslations("nav");
  const p = await getTranslations("pages");
  const f = await getTranslations("footer");
  const j = await getTranslations("join");
  const e = await getTranslations("events");

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

      <HomeIntro
        eyebrow={a("eyebrow")}
        title={a("title")}
        lead={a("lead")}
        learnMore={t("learnMore")}
      />

      <Stats
        items={[
          { value: st("membersValue"), label: st("membersLabel") },
          { value: st("sinceValue"), label: st("sinceLabel") },
          { value: st("eventsValue"), label: st("eventsLabel") },
        ]}
      />

      <Highlights
        title={t("discoverTitle")}
        subtitle={t("discoverSubtitle")}
        cta={f("explore")}
        cards={[
          {
            href: "/events",
            title: n("events"),
            text: p("eventsSubtitle"),
            image: "https://loremflickr.com/600/400/bangladesh,festival?lock=71",
            fallbackColor: "#22335c",
          },
          {
            href: "/new-students",
            title: n("newStudents"),
            text: p("newStudentsSubtitle"),
            image: "https://loremflickr.com/600/400/student,germany?lock=72",
            fallbackColor: "#006a4e",
          },
          {
            href: "/gallery",
            title: n("gallery"),
            text: p("gallerySubtitle"),
            image: "https://loremflickr.com/600/400/bangladesh,people?lock=73",
            fallbackColor: "#b23a48",
          },
        ]}
      />

      <Join title={j("title")} body={j("body")} cta={j("cta")} />
    </div>
  );
}
