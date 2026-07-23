import Image from "next/image";
import { siteConfig } from "@/config/site";
import { LanguageSwitcher } from "@/components/layout/language-switcher";

/**
 * Sticky site header: emblem + name, section navigation, language switcher.
 */
export function SiteHeader({
  links,
}: {
  links: { href: string; label: string }[];
}) {
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
        <a href="#top" className="flex items-center gap-2.5">
          <Image
            src="/logo.png"
            alt={`${siteConfig.shortName} logo`}
            width={36}
            height={36}
            className="rounded-full ring-1 ring-border"
          />
          <span className="font-display text-base leading-tight font-semibold text-foreground">
            {siteConfig.shortName}
          </span>
        </a>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <LanguageSwitcher />
      </div>
    </header>
  );
}
