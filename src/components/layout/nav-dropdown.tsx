"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { NavLink } from "@/components/layout/nav-links";

/**
 * A nav item that opens a small menu. Used for Jobs, which leads to two very
 * different places depending on who is looking.
 */
export function NavDropdown({
  label,
  items,
}: {
  label: string;
  items: NonNullable<NavLink["children"]>;
}) {
  const [open, setOpen] = useState(false);
  const wrapper = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    // Opens on hover, but focus and click still work, so it stays usable from
    // the keyboard and on touch screens where there is no hover at all.
    <div
      ref={wrapper}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
      className="relative"
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
      >
        {label}
        <ChevronDown
          className={`size-3.5 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>

      {open && (
        <div
          role="menu"
          // pt-2 keeps the gap under the trigger inside the hover area, so the
          // menu does not close while the pointer travels down to it.
          className="absolute top-full left-1/2 z-50 w-max min-w-56 -translate-x-1/2 pt-2"
        >
          <div className="overflow-hidden rounded-xl border border-border bg-background shadow-lg">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                role="menuitem"
                onClick={() => setOpen(false)}
                className="block px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-muted/40"
              >
                {item.label}
                {item.note && (
                  <span className="text-muted-foreground"> ({item.note})</span>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
