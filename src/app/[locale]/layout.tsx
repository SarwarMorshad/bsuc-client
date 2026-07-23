import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Fraunces, Inter, Tiro_Bangla } from "next/font/google";
import "../globals.css";
import { Providers } from "../providers";
import { routing } from "@/i18n/routing";
import { siteConfig } from "@/config/site";
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

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
};

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

  const tn = await getTranslations("nav");
  const tf = await getTranslations("footer");
  const navLinks = [
    { href: "#about", label: tn("about") },
    { href: "#doing", label: tn("doing") },
    { href: "#events", label: tn("events") },
    { href: "#support", label: tn("support") },
    { href: "#join", label: tn("join") },
  ];

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${fraunces.variable} ${tiroBangla.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider>
          <Providers>
            <SmoothScroll>
              <SiteHeader links={navLinks} />
              <main className="flex-1">{children}</main>
              <SiteFooter
                tagline={tf("tagline")}
                rights={tf("rights")}
                links={navLinks}
              />
            </SmoothScroll>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
