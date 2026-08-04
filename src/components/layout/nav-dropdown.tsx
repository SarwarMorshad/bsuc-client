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

    const onPointerDown = (e: PointerEvent) => {
      if (!wrapper.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={wrapper} className="relative">
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
          className="absolute top-full left-1/2 z-50 mt-2 w-64 -translate-x-1/2 overflow-hidden rounded-xl border border-border bg-background shadow-lg"
        >
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="block px-4 py-3 transition-colors hover:bg-muted/40"
            >
              <span className="block text-sm font-medium text-foreground">
                {item.label}
              </span>
              {item.hint && (
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  {item.hint}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
