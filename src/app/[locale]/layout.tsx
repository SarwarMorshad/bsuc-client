import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Fraunces, Inter, Tiro_Bangla } from "next/font/google";
import "../globals.css";
import { Providers } from "../providers";
import { routing } from "@/i18n/routing";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/metadata";
import { SmoothScroll } from "@/components/layout/smooth-scroll";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const tiroBangla = Tiro_Bangla({
  weight: "400",
  subsets: ["bengali", "latin"],
  variable: "--font-tiro-bangla",
  display: "swap",
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages" });

  return {
    ...buildMetadata({
      locale,
      path: "",
      title: siteConfig.name,
      description: siteConfig.description,
    }),
    metadataBase: new URL(siteConfig.url),
    // Child pages render as "Events · Bangladesh Student Union Chemnitz"
    title: {
      default: siteConfig.name,
      template: `%s · ${siteConfig.shortName}`,
    },
    applicationName: siteConfig.name,
    keywords: [
      "Bangladesh Student Union",
      "Chemnitz",
      "TU Chemnitz",
      "Bangladeshi students",
      "BSUC",
      t("eventsTitle"),
    ],
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${fraunces.variable} ${tiroBangla.variable} h-full antialiased`}
    >
      {/*
        Browser extensions (Grammarly and similar) add attributes to <body>
        before React hydrates, which otherwise reports a hydration mismatch.
        This only suppresses warnings for this element's own attributes, so
        genuine mismatches inside the app are still reported.
      */}
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <NextIntlClientProvider>
          {/* The public site chrome lives in the (site) layout, so the admin
              dashboard can render its own full-screen shell instead. */}
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
