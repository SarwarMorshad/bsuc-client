import { siteConfig } from "@/config/site";
import { MotifIcon } from "@/components/motifs/motif-icon";

/** Contact — email, address and social links. */
export function Contact({
  emailLabel,
  socialLabel,
  addressLabel,
  address,
}: {
  emailLabel: string;
  socialLabel: string;
  addressLabel: string;
  address: string;
}) {
  const socials = [
    { label: "Facebook", href: siteConfig.links.facebook },
    { label: "Instagram", href: siteConfig.links.instagram },
    { label: "WhatsApp", href: siteConfig.links.whatsapp },
  ].filter((s) => s.href);

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto grid max-w-5xl gap-6 px-6 sm:grid-cols-3">
        {/* Email */}
        <div className="flex flex-col items-start gap-3 rounded-xl border border-dashed border-border bg-cream p-6">
          <MotifIcon name="star" className="h-8 w-8 text-madder" />
          <h2 className="font-display text-lg font-semibold text-foreground">
            {emailLabel}
          </h2>
          <a
            href={`mailto:${siteConfig.links.email}`}
            className="text-sm text-brand-blue underline-offset-4 hover:underline"
          >
            {siteConfig.links.email}
          </a>
        </div>

        {/* Address */}
        <div className="flex flex-col items-start gap-3 rounded-xl border border-dashed border-border bg-cream p-6">
          <MotifIcon name="leaf" className="h-8 w-8 text-bd-green" />
          <h2 className="font-display text-lg font-semibold text-foreground">
            {addressLabel}
          </h2>
          <p className="text-sm text-muted-foreground">{address}</p>
        </div>

        {/* Socials */}
        <div className="flex flex-col items-start gap-3 rounded-xl border border-dashed border-border bg-cream p-6">
          <MotifIcon name="flower" className="h-8 w-8 text-marigold" />
          <h2 className="font-display text-lg font-semibold text-foreground">
            {socialLabel}
          </h2>
          <ul className="flex flex-col gap-1.5">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-brand-blue underline-offset-4 hover:underline"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
