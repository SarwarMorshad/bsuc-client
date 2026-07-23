import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { siteConfig } from "@/config/site";

/**
 * Temporary Phase 1 starting hero — showcases the brand palette, fonts, logo,
 * and locale-aware copy. This will be replaced by the Nakshi Kantha scroll panels.
 */

const palette = [
  { name: "Blue", className: "bg-brand-blue" },
  { name: "Green", className: "bg-bd-green" },
  { name: "Red", className: "bg-bd-red" },
  { name: "Marigold", className: "bg-marigold" },
  { name: "Indigo", className: "bg-indigo" },
  { name: "Silver", className: "bg-silver" },
];

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-10 px-6 py-16 text-center">
      <Image
        src="/logo.png"
        alt={`${siteConfig.shortName} logo`}
        width={180}
        height={180}
        priority
        className="rounded-full shadow-lg ring-1 ring-border"
      />

      <div className="flex flex-col items-center gap-4">
        <p className="text-sm font-medium uppercase tracking-[0.25em] text-brand-blue">
          {siteConfig.shortName}
        </p>
        <h1 className="max-w-3xl font-display text-4xl leading-tight font-semibold text-foreground sm:text-6xl">
          {siteConfig.name}
        </h1>
      </div>

      <p className="text-xl text-foreground">{t("welcome")}</p>

      <p className="max-w-md text-balance text-accent">{t("tagline")}</p>

      {/* Palette preview — confirms the central theme tokens */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
        {palette.map((c) => (
          <div key={c.name} className="flex flex-col items-center gap-1">
            <span
              className={`h-8 w-8 rounded-full ring-1 ring-border ${c.className}`}
            />
            <span className="text-xs text-muted-foreground">{c.name}</span>
          </div>
        ))}
      </div>
    </main>
  );
}
