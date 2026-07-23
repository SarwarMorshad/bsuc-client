# Project structure — bsuc-client

A map of where things live and what belongs where. Keep new files in the folder
that matches their role so the project stays easy to navigate.

```
bsuc-client/
├── messages/                  # i18n message catalogs (one file per locale)
│   ├── en.json                #   English (primary / fallback)
│   ├── bn.json                #   Bangla
│   └── de.json                #   Deutsch
├── public/                    # static assets served as-is
│   ├── logo.png               #   BSUC logo
│   └── images/                #   photos, textures, motif exports
├── src/
│   ├── app/                   # Next.js App Router (routes only)
│   │   ├── [locale]/          #   locale segment (en at /, bn at /bn, de at /de)
│   │   │   ├── layout.tsx     #     root layout: <html>, fonts, providers, header
│   │   │   ├── (public)/      #     PUBLIC immersive site (route group, no URL segment)
│   │   │   │   └── page.tsx   #       home — the Nakshi Kantha experience
│   │   │   ├── (auth)/        #     login / signup            (Phase 2)
│   │   │   ├── dashboard/     #     member area               (Phase 2–3)
│   │   │   └── admin/         #     admin panel               (Phase 4)
│   │   ├── globals.css        #   Tailwind entry + base styles
│   │   ├── providers.tsx      #   client providers (TanStack Query)
│   │   └── favicon.ico
│   ├── components/            # reusable React components (NOT routes)
│   │   ├── layout/            #   header, footer, nav, language-switcher
│   │   ├── panels/            #   the immersive scroll panels (Hero, Lotus, …)
│   │   ├── motifs/            #   hand-drawn Nakshi Kantha SVG motifs
│   │   └── ui/                #   shadcn/ui primitives            (Phase 2+)
│   ├── config/               # central configuration
│   │   └── site.ts           #   site identity, locales, fonts, links
│   ├── i18n/                 # next-intl setup
│   │   ├── routing.ts        #   locales + defaultLocale + localePrefix
│   │   ├── navigation.ts     #   locale-aware Link / router helpers
│   │   └── request.ts        #   per-request locale + messages
│   ├── lib/                  # non-UI logic
│   │   ├── api.ts            #   Axios instance for the bsuc-server API
│   │   └── hooks/            #   reusable React hooks
│   ├── styles/               # global styling
│   │   └── theme.css         #   ⭐ central design tokens (colors, fonts) — SINGLE source of truth
│   ├── types/                # shared TypeScript types
│   └── proxy.ts              # Next 16 proxy (i18n middleware)
├── next.config.ts            # Next config (wrapped with next-intl plugin)
└── STRUCTURE.md              # this file
```

## Conventions

- **Colors:** never hardcode hex. Define tokens in `src/styles/theme.css`; use the
  generated Tailwind classes (`bg-primary`, `text-bd-green`, …).
- **Config values** (name, locales, fonts, links): put them in `src/config/site.ts`.
- **Copy/text:** never hardcode user-facing strings. Add them to `messages/*.json`
  and read via `useTranslations` / `getTranslations`.
- **`app/` holds routes only.** Reusable pieces go in `components/`, logic in `lib/`.
- **Route groups** `(public)`, `(auth)` organize routes without adding URL segments.
- **Import alias:** `@/` → `src/` (e.g. `import { siteConfig } from "@/config/site"`).
- **Naming:** components `kebab-case.tsx`; one component per file where practical.
