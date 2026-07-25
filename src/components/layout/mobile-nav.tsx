"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";

/** Hamburger menu for small screens: nav links + Join CTA in a dropdown. */
export function MobileNav({
  links,
  joinLabel,
  loginLabel,
}: {
  links: { href: string; label: string }[];
  joinLabel: string;
  loginLabel: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Menu"
        aria-expanded={open}
        className="flex h-10 w-10 items-center justify-center rounded-md text-foreground hover:bg-muted/30"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full border-b border-border bg-background shadow-md">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-4">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm text-foreground hover:bg-muted/30"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full border border-indigo/40 px-5 py-2.5 text-center text-sm font-medium text-indigo"
            >
              {loginLabel}
            </Link>
            <Link
              href="/join"
              onClick={() => setOpen(false)}
              className="rounded-full bg-bd-green px-5 py-2.5 text-center text-sm font-medium text-cream"
            >
              {joinLabel}
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}
