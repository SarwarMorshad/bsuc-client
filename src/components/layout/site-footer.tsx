import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/config/site";
import { MotifStrip } from "@/components/motifs/motif-strip";

type IconName = "facebook" | "instagram" | "whatsapp" | "mail";

function SocialIcon({ name }: { name: IconName }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    "aria-hidden": true as const,
  };
  switch (name) {
    case "facebook":
      return (
        <svg {...common} fill="currentColor">
          <path d="M14 9h3V5.5h-3c-2 0-3.5 1.6-3.5 3.6V11H8v3.5h2.5V21h3.5v-6.5h2.6L17 11h-3V9.4c0-.3.2-.4.5-.4z" />
        </svg>
      );
    case "instagram":
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17" cy="7" r="1.1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "whatsapp":
      return (
        <svg {...common} fill="currentColor">
          <path d="M12 2a10 10 0 0 0-8.5 15.2L2 22l4.9-1.4A10 10 0 1 0 12 2zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-2.9.8.8-2.8-.2-.3A8 8 0 1 1 12 20zm4.4-5.6c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1l-.7.9c-.1.2-.3.2-.5.1a6.5 6.5 0 0 1-3.2-2.8c-.1-.2 0-.4.1-.5l.4-.5c.1-.2.1-.3 0-.5l-.7-1.7c-.2-.4-.4-.4-.5-.4h-.5c-.2 0-.5.1-.7.3-.8.8-1 1.9-.6 3a9 9 0 0 0 4.9 4.4c1.4.5 2.4.4 3.1-.1.3-.3.6-.8.7-1.2.1-.3 0-.5-.1-.6z" />
        </svg>
      );
    case "mail":
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3" y="5" width="18" height="14" rx="2.5" />
          <path d="M4 7l8 6 8-6" />
        </svg>
      );
  }
}

/**
 * Site footer — a modern multi-column footer closing the page in a deep green
 * kantha band: brand + socials, explore links, and a bottom legal bar.
 */
export async function SiteFooter() {
  const t = await getTranslations("footer");
  const n = await getTranslations("nav");
  const p = await getTranslations("privacy");

  const explore = [
    { href: "/about", label: n("about") },
    { href: "/events", label: n("events") },
    { href: "/new-students", label: n("newStudents") },
    { href: "/gallery", label: n("gallery") },
  ];
  const involved = [
    { href: "/join", label: n("join") },
    { href: "/contact", label: n("contact") },
  ];
  const socials: { name: IconName; href: string; label: string }[] = [
    { name: "mail", href: `mailto:${siteConfig.links.email}`, label: "Email" },
    { name: "facebook", href: siteConfig.links.facebook, label: "Facebook" },
    { name: "instagram", href: siteConfig.links.instagram, label: "Instagram" },
    { name: "whatsapp", href: siteConfig.links.whatsapp, label: "WhatsApp" },
  ];

  return (
    <footer className="bg-bd-green text-cream">
      <MotifStrip className="bg-background" />

      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-12">
          {/* Brand */}
          <div className="flex flex-col gap-5 md:col-span-5">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt={`${siteConfig.shortName} logo`}
                width={52}
                height={52}
                className="rounded-full ring-2 ring-cream/40"
              />
              <span className="font-display text-lg leading-tight font-semibold">
                {siteConfig.name}
              </span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-cream/80">
              {t("tagline")}
            </p>
            <div className="flex items-center gap-3">
              {socials.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  aria-label={s.label}
                  target={s.name === "mail" ? undefined : "_blank"}
                  rel={s.name === "mail" ? undefined : "noopener noreferrer"}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-cream/10 text-cream transition-colors hover:bg-marigold hover:text-ink"
                >
                  <SocialIcon name={s.name} />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div className="md:col-span-4">
            <h3 className="mb-4 text-xs font-semibold tracking-[0.2em] text-cream/60 uppercase">
              {t("explore")}
            </h3>
            <ul className="flex flex-col gap-2.5">
              {explore.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-cream/85 underline-offset-4 transition-colors hover:text-cream hover:underline"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get involved */}
          <div className="md:col-span-3">
            <h3 className="mb-4 text-xs font-semibold tracking-[0.2em] text-cream/60 uppercase">
              {t("getInvolved")}
            </h3>
            <ul className="flex flex-col gap-2.5">
              {involved.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-cream/85 underline-offset-4 transition-colors hover:text-cream hover:underline"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/join"
              className="mt-5 inline-block rounded-full bg-marigold px-5 py-2 text-sm font-medium text-ink transition-transform hover:scale-[1.03]"
            >
              {n("join")}
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-cream/20 pt-6 text-xs text-cream/70 sm:flex-row">
          <span>
            © {new Date().getFullYear()} {siteConfig.name}. {t("rights")}
          </span>
          <span className="flex items-center gap-4">
            <Link
              href="/privacy"
              className="underline-offset-4 hover:underline"
            >
              {p("title")}
            </Link>
            <span>{t("madeWith")}</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
