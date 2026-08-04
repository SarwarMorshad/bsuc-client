"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import type { NavLink } from "@/components/layout/nav-links";

/**
 * Hamburger menu for small screens. Signed-out visitors get the nav links plus
 * Log in / Join; signed-in members see their photo, account link and Log out.
 */
export function MobileNav({
  links,
  joinLabel,
  loginLabel,
}: {
  links: NavLink[];
  joinLabel: string;
  loginLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const t = useTranslations("nav");
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  const close = () => setOpen(false);

  const initials = user
    ? user.name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase())
        .join("")
    : "";

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Menu"
        aria-expanded={open}
        className="flex h-10 w-10 items-center justify-center rounded-md text-foreground hover:bg-muted/30"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          {open ? (
            <path d="M6 6l12 12M18 6L6 18" />
          ) : (
            <path d="M4 7h16M4 12h16M4 17h16" />
          )}
        </svg>
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full border-b border-border bg-background shadow-md">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-4">
            {/* Signed-in member: photo, name and email */}
            {user && (
              <Link
                href="/profile"
                onClick={close}
                className="mb-2 flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-muted/30"
              >
                {user.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.avatarUrl}
                    alt=""
                    className="h-10 w-10 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-bd-green text-sm font-semibold text-cream"
                    aria-hidden="true"
                  >
                    {initials}
                  </span>
                )}
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-foreground">
                    {user.name}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {user.email}
                  </span>
                </span>
              </Link>
            )}

            {links.map((l) =>
              l.children ? (
                // Nested items are listed inline rather than behind another
                // tap — a slide-out menu has room, and hiding them would make
                // the employer link even harder to find.
                <div key={l.label} className="flex flex-col">
                  <span className="px-3 pt-2 pb-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    {l.label}
                  </span>
                  {l.children.map((c) => (
                    <Link
                      key={c.href}
                      href={c.href}
                      onClick={close}
                      className="rounded-md px-3 py-2 pl-5 text-sm text-foreground hover:bg-muted/30"
                    >
                      {c.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={close}
                  className="rounded-md px-3 py-2.5 text-sm text-foreground hover:bg-muted/30"
                >
                  {l.label}
                </Link>
              ),
            )}

            {/* Account actions — hidden until the session resolves, so the
                menu never flashes the wrong state. */}
            {!loading &&
              (user ? (
                <button
                  type="button"
                  onClick={async () => {
                    close();
                    await signOut();
                    router.replace("/");
                  }}
                  className="mt-2 rounded-full border border-madder/40 px-5 py-2.5 text-center text-sm font-medium text-madder"
                >
                  {t("logout")}
                </button>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={close}
                    className="mt-2 rounded-full border border-indigo/40 px-5 py-2.5 text-center text-sm font-medium text-indigo"
                  >
                    {loginLabel}
                  </Link>
                  <Link
                    href="/join"
                    onClick={close}
                    className="rounded-full bg-bd-green px-5 py-2.5 text-center text-sm font-medium text-cream"
                  >
                    {joinLabel}
                  </Link>
                </>
              ))}
          </nav>
        </div>
      )}
    </div>
  );
}
