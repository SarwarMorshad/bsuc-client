# bsuc-client

Frontend for the **Bangladesh Student Union Chemnitz** website — an immersive, scroll-driven
"Nakshi Kantha unfold" experience, plus member and admin areas.

## Stack

- **Next.js 16** (App Router) + **TypeScript** + **Tailwind CSS**
- **GSAP + ScrollTrigger + Lenis** — scroll-driven stitch animations
- **React Three Fiber + drei** — the hero cloth-unfold moment (lazy-loaded)
- **TanStack Query + Axios** — data from the `bsuc-server` REST API

## Getting started

```bash
npm install
cp .env.example .env.local   # then set NEXT_PUBLIC_API_URL
npm run dev
```

Open http://localhost:3000.

## Structure

```
src/
  app/          App Router routes, layout, providers
  components/   UI + Nakshi Kantha motifs
  lib/          api client, helpers
```

## Backend

API lives in a separate repo: **bsuc-server** (Node + Express + PostgreSQL + Prisma).
