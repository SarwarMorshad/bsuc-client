import Image from "next/image";
import { siteConfig } from "@/config/site";
import { MotifStrip } from "@/components/motifs/motif-strip";

/**
 * Site footer — a deep green band closing the quilt, with the emblem, tagline
 * and section links.
 */
export function SiteFooter({
  tagline,
  rights,
  links,
}: {
  tagline: string;
  rights: string;
  links: { href: string; label: string }[];
}) {
  return (
    <footer className="bg-bd-green text-cream">
      <MotifStrip className="bg-background" />
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-14 text-center">
        <Image
          src="/logo.png"
          alt={`${siteConfig.shortName} logo`}
          width={64}
          height={64}
          className="rounded-full ring-2 ring-cream/40"
        />
        <p className="font-display text-xl font-semibold">{siteConfig.name}</p>
        <p className="max-w-md text-sm text-cream/80">{tagline}</p>

        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-cream/85 underline-offset-4 hover:underline"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="mt-2 h-px w-24 bg-cream/30" />
        <p className="text-xs text-cream/70">
          © {new Date().getFullYear()} {siteConfig.name}. {rights}
        </p>
      </div>
    </footer>
  );
}
