"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { useAuth } from "@/components/auth/auth-provider";

/**
 * Header account area: sign-in / join buttons when signed out, and a dropdown
 * with the member's name and a log-out action when signed in.
 */
export function AccountMenu() {
  const t = useTranslations("nav");
  const { user, loading, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  // Reserve the space while the session resolves so the header doesn't jump.
  if (loading) {
    return <div className="hidden h-9 w-32 sm:block" aria-hidden="true" />;
  }

  if (!user) {
    return (
      <>
        <Link
          href="/login"
          className="hidden rounded-full border border-indigo/40 px-4 py-2 text-sm font-medium text-indigo transition-colors hover:bg-indigo/5 sm:inline-block"
        >
          {t("login")}
        </Link>
        <Link
          href="/join"
          className="hidden rounded-full bg-bd-green px-5 py-2 text-sm font-medium text-cream transition-transform hover:scale-[1.03] sm:inline-block"
        >
          {t("join")}
        </Link>
      </>
    );
  }

  const initials = user.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

  return (
    <div ref={ref} className="relative hidden sm:block">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={t("account")}
        className="flex items-center gap-2 rounded-full border border-border py-1 pr-3 pl-1 transition-colors hover:bg-muted/30"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-bd-green text-xs font-semibold text-cream">
          {initials}
        </span>
        <span className="max-w-[8rem] truncate text-sm text-foreground">
          {user.name.split(" ")[0]}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 min-w-[13rem] overflow-hidden rounded-lg border border-border bg-background shadow-lg">
          <div className="border-b border-border px-4 py-3">
            <p className="truncate text-sm font-medium text-foreground">
              {user.name}
            </p>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          </div>
          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-muted/30"
          >
            {t("account")}
          </Link>
          <button
            type="button"
            onClick={async () => {
              setOpen(false);
              await signOut();
              router.replace("/");
            }}
            className="w-full border-t border-border px-4 py-2.5 text-left text-sm text-foreground transition-colors hover:bg-muted/30"
          >
            {t("logout")}
          </button>
        </div>
      )}
    </div>
  );
}
