import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { localeUrl } from "@/lib/metadata";

/** Public routes included in the sitemap, with their relative priority. */
const ROUTES: { path: string; priority: number }[] = [
  { path: "", priority: 1 },
  { path: "/about", priority: 0.8 },
  { path: "/events", priority: 0.9 },
  { path: "/new-students", priority: 0.9 },
  { path: "/gallery", priority: 0.6 },
  { path: "/contact", priority: 0.7 },
  { path: "/join", priority: 0.8 },
];

/**
 * Sitemap with hreflang alternates for every locale. /jobs and /login are
 * omitted: the job portal becomes a private route, and the login page has no
 * standalone value for search.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return ROUTES.map(({ path, priority }) => ({
    url: localeUrl(routing.defaultLocale, path),
    lastModified,
    changeFrequency: "monthly" as const,
    priority,
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((locale) => [locale, localeUrl(locale, path)]),
      ),
    },
  }));
}
