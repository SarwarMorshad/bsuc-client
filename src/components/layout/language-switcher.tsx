"use client";

import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { siteConfig } from "@/config/site";

/**
 * Switches locale while keeping the current path. Uses next-intl's locale-aware
 * Link so the target locale is applied on navigation.
 */
export function LanguageSwitcher() {
  const pathname = usePathname();
  const active = useLocale();

  return (
    <nav aria-label="Language" className="flex items-center gap-1 text-sm">
      {siteConfig.locales.map((loc) => {
        const isActive = loc === active;
        return (
          <Link
            key={loc}
            href={pathname}
            locale={loc}
            aria-current={isActive ? "true" : undefined}
            className={
              isActive
                ? "rounded-full bg-primary px-3 py-1 font-medium text-primary-foreground"
                : "rounded-full px-3 py-1 text-muted-foreground hover:text-foreground"
            }
          >
            {siteConfig.localeLabels[loc]}
          </Link>
        );
      })}
    </nav>
  );
}
