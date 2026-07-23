import Image from "next/image";
import { siteConfig } from "@/config/site";

/**
 * Temporary Phase 1 starting hero — showcases the brand palette, fonts, logo,
 * and trilingual copy. This will be replaced by the Nakshi Kantha scroll panels.
 */

const palette = [
  { name: "Blue", className: "bg-brand-blue" },
  { name: "Green", className: "bg-bd-green" },
  { name: "Red", className: "bg-bd-red" },
  { name: "Marigold", className: "bg-marigold" },
  { name: "Indigo", className: "bg-indigo" },
  { name: "Silver", className: "bg-silver" },
];

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-10 px-6 py-20 text-center">
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

      {/* Trilingual welcome — English (primary), Bangla, Deutsch */}
      <div className="flex flex-col items-center gap-2 text-lg text-muted-foreground">
        <p>Welcome to our community.</p>
        <p className="font-bangla text-xl text-foreground" lang="bn">
          আমাদের কমিউনিটিতে স্বাগতম।
        </p>
        <p lang="de">Willkommen in unserer Gemeinschaft.</p>
      </div>

      <p className="max-w-md text-balance text-accent">
        An immersive Nakshi Kantha experience is being stitched together.
      </p>

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
