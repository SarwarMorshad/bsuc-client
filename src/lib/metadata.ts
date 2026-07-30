import type { Metadata } from "next";
import { siteConfig, type Locale } from "@/config/site";
import { routing } from "@/i18n/routing";

/**
 * Builds the localised URL for a path. English is the default locale and has
 * no prefix (localePrefix: "as-needed"); other locales are prefixed.
 */
/**
 * The generated Open Graph card. Its content is identical for every locale, so
 * the default-locale route is used everywhere.
 */
const OG_IMAGE = `${siteConfig.url}/opengraph-image`;

export function localeUrl(locale: string, path = "") {
  const clean = path === "/" ? "" : path;
  const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
  return `${siteConfig.url}${prefix}${clean}`;
}

/**
 * Per-page metadata with a canonical URL and hreflang alternates for every
 * locale, plus Open Graph / Twitter cards. `path` is the unprefixed route
 * (e.g. "/events"); use "" or "/" for the home page.
 */
export function buildMetadata({
  locale,
  path = "",
  title,
  description,
}: {
  locale: string;
  path?: string;
  title: string;
  description: string;
}): Metadata {
  const url = localeUrl(locale, path);

  const languages = Object.fromEntries(
    routing.locales.map((l: Locale) => [l, localeUrl(l, path)]),
  );

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: { ...languages, "x-default": localeUrl(routing.defaultLocale, path) },
    },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      title,
      description,
      url,
      locale,
      // Declared explicitly: defining `openGraph` here would otherwise drop the
      // image that the opengraph-image file convention contributes.
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: siteConfig.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE],
    },
  };
}
