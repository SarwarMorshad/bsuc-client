import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/config/site";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { MobileNav } from "@/components/layout/mobile-nav";

/**
 * Sticky site header: emblem + name, page navigation, language switcher and a
 * Join call to action. Uses locale-aware links so navigation keeps the locale.
 */
export function SiteHeader({
  links,
  joinLabel,
  loginLabel,
}: {
  links: { href: string; label: string }[];
  joinLabel: string;
  loginLabel: string;
}) {
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
        <Link href="/" className="flex items-center gap-2.5">
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
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <Link
            href="/login"
            className="hidden rounded-full border border-indigo/40 px-4 py-2 text-sm font-medium text-indigo transition-colors hover:bg-indigo/5 sm:inline-block"
          >
            {loginLabel}
          </Link>
          <Link
            href="/join"
            className="hidden rounded-full bg-bd-green px-5 py-2 text-sm font-medium text-cream transition-transform hover:scale-[1.03] sm:inline-block"
          >
            {joinLabel}
          </Link>
          <MobileNav
            links={links}
            joinLabel={joinLabel}
            loginLabel={loginLabel}
          />
        </div>
      </div>
    </header>
  );
}
