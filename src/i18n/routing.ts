import { defineRouting } from "next-intl/routing";
import { siteConfig } from "@/config/site";

/**
 * Locale routing config. Locales and default come from the central site config
 * so there's one source of truth. English is the default (no prefix on `/`).
 */
export const routing = defineRouting({
  locales: siteConfig.locales,
  defaultLocale: siteConfig.defaultLocale,
  // English (default) has no prefix (/); Bangla and German are /bn and /de.
  localePrefix: "as-needed",
});
