import Image from "next/image";
import { siteConfig } from "@/config/site";
import { RunningStitch } from "@/components/motifs/running-stitch";
import { ClothUnfoldLazy } from "@/components/three/cloth-unfold-lazy";

/**
 * Hero — a pinned panel where the nakshi kantha is gradually stitched into
 * being as the visitor scrolls: the embroidery blooms outward from the centre
 * until the quilt is complete. Height must match STITCH_SPAN (1.8) + 1 viewport.
 */
export function Hero({
  welcome,
  tagline,
  scrollCue,
}: {
  welcome: string;
  tagline: string;
  scrollCue: string;
}) {
  return (
    <section className="relative h-[280vh]">
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
        {/* The cloth being stitched */}
        <ClothUnfoldLazy />

        {/* Cream scrim so the title stays legible below the cloth */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[26%]"
          style={{
            background:
              "linear-gradient(to top, var(--color-cream) 30%, color-mix(in srgb, var(--color-cream) 40%, transparent) 62%, transparent 100%)",
          }}
          aria-hidden="true"
        />

        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-3 px-8 pb-12 text-center">
          <Image
            src="/logo.png"
            alt={`${siteConfig.shortName} logo`}
            width={104}
            height={104}
            priority
            className="animate-fade-up rounded-full bg-cream shadow-md ring-2 ring-madder/40"
          />
          <p
            className="animate-fade-up text-xs font-medium tracking-[0.3em] text-brand-blue uppercase"
            style={{ animationDelay: "0.1s" }}
          >
            {siteConfig.shortName}
          </p>
          <h1
            className="animate-fade-up max-w-3xl font-display text-4xl leading-[1.05] font-semibold text-foreground sm:text-6xl"
            style={{ animationDelay: "0.2s" }}
          >
            {siteConfig.name}
          </h1>
          <RunningStitch className="w-40 text-madder" delayMs={700} />
          <p
            className="animate-fade-up text-lg text-foreground"
            style={{ animationDelay: "0.35s" }}
          >
            {welcome}
          </p>
          <p
            className="animate-fade-up max-w-md text-balance text-sm text-muted-foreground"
            style={{ animationDelay: "0.45s" }}
          >
            {tagline}
          </p>

          <div className="animate-bob mt-2 flex flex-col items-center gap-1 text-muted-foreground">
            <span className="text-xs tracking-[0.2em] uppercase">
              {scrollCue}
            </span>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
