/**
 * Central website configuration — the single source of truth for site-wide
 * values (identity, languages, fonts, links).
 *
 * Colors live in the design tokens (src/styles/theme.css). This file holds the
 * non-styling config so it can be changed in one place.
 */

export const siteConfig = {
  /** Full official name (matches the logo). */
  name: "Bangladesh Student Union Chemnitz",
  /** Short name / acronym. */
  shortName: "BSUC",
  /** Used for meta description, OG tags, etc. */
  description:
    "Community of Bangladeshi students in Chemnitz — events, support, and belonging.",
  /** Public URL (set once deployed). */
  url: "https://bsuc.example",

  /** Internationalization. English is primary/default. */
  locales: ["en", "bn", "de"] as const,
  defaultLocale: "en",
  /** Native label shown in the language switcher. */
  localeLabels: {
    en: "English",
    bn: "বাংলা",
    de: "Deutsch",
  },

  /**
   * Fonts (the "Warm & Handmade" set). Each is self-hosted via next/font and
   * exposed as a CSS variable that the theme tokens (theme.css) consume.
   * `family` documents the source font; `variable` is the CSS var name.
   */
  fonts: {
    display: {
      family: "Fraunces",
      variable: "--font-display",
      role: "Headings — warm serif, handmade character",
    },
    sans: {
      family: "Inter",
      variable: "--font-sans",
      role: "Body / UI — English + German",
    },
    bangla: {
      family: "Tiro Bangla",
      variable: "--font-bangla",
      role: "Bangla script (bn locale)",
    },
  },

  /** Social / contact links (placeholders — replace with real handles). */
  links: {
    email: "hello@bsuc-chemnitz.de",
    facebook: "https://facebook.com/",
    instagram: "https://instagram.com/",
    whatsapp: "https://chat.whatsapp.com/",
  },
} as const;

export type SiteConfig = typeof siteConfig;
export type Locale = (typeof siteConfig.locales)[number];
