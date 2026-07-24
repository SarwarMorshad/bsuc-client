"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/config/site";

export type Slide = { title: string; text: string };

/**
 * Real Bangladesh-related photos (keyword-based, from a Flickr placeholder
 * service) with the on-brand SVG as an automatic fallback if a photo fails.
 * Replace the remote URLs with owned/licensed photos for production.
 */
const IMAGES = [
  "https://loremflickr.com/1600/900/dhaka,bangladesh?lock=11",
  "https://loremflickr.com/1600/900/rickshaw,bangladesh?lock=27",
  "https://loremflickr.com/1600/900/bangladesh,festival?lock=39",
  "https://loremflickr.com/1600/900/bangladesh,river,boat?lock=44",
];
const FALLBACK = [
  "/hero/slide-1.svg",
  "/hero/slide-2.svg",
  "/hero/slide-3.svg",
  "/hero/slide-4.svg",
];
const FALLBACK_COLOR = ["#22335c", "#b23a48", "#0067b1", "#006a4e"];

const AUTOPLAY_MS = 5500;

/**
 * HeroCarousel — a swipeable image carousel with per-slide text over real
 * photos: autoplay, crossfade, arrows, dots, touch-swipe, pause on hover,
 * reduced-motion aware.
 */
export function HeroCarousel({
  slides,
  ctaPrimary,
  ctaSecondary,
}: {
  slides: Slide[];
  ctaPrimary: string;
  ctaSecondary: string;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);
  const count = slides.length;

  const go = useCallback(
    (dir: number) => setIndex((i) => (i + dir + count) % count),
    [count],
  );

  useEffect(() => {
    if (paused) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => go(1), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused, go, index]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
    touchX.current = null;
  };

  const active = slides[index];

  return (
    <section
      className="relative h-[86vh] min-h-[560px] overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      aria-roledescription="carousel"
      aria-label="Community highlights"
    >
      {/* Slides — real photo with SVG + colour fallback */}
      {slides.map((_, i) => (
        <div
          key={i}
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-out"
          style={{
            backgroundColor: FALLBACK_COLOR[i % FALLBACK_COLOR.length],
            backgroundImage: `url("${IMAGES[i % IMAGES.length]}"), url("${FALLBACK[i % FALLBACK.length]}")`,
            opacity: i === index ? 1 : 0,
          }}
          aria-hidden={i !== index}
        />
      ))}

      {/* Legibility scrim */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(16,22,36,0.82) 0%, rgba(16,22,36,0.5) 45%, rgba(16,22,36,0.2) 100%)",
        }}
        aria-hidden="true"
      />

      {/* Overlay content */}
      <div className="relative mx-auto flex h-full max-w-6xl items-center px-6">
        <div className="flex max-w-xl flex-col items-start gap-5 text-left text-cream">
          <span className="text-xs font-medium tracking-[0.3em] text-cream/70 uppercase">
            {siteConfig.name}
          </span>

          <h1
            key={`t-${index}`}
            className="animate-fade-up font-display text-4xl leading-[1.06] font-semibold sm:text-5xl lg:text-6xl"
          >
            {active.title}
          </h1>

          <p
            key={`x-${index}`}
            className="animate-fade-up max-w-md text-lg leading-relaxed text-cream/90"
            style={{ animationDelay: "0.08s" }}
          >
            {active.text}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/join"
              className="rounded-full bg-marigold px-7 py-3 font-medium text-ink shadow-sm transition-transform hover:scale-[1.03]"
            >
              {ctaPrimary}
            </Link>
            <Link
              href="/events"
              className="rounded-full border border-cream/50 px-7 py-3 font-medium text-cream transition-colors hover:bg-cream/10"
            >
              {ctaSecondary}
            </Link>
          </div>
        </div>
      </div>

      {/* Arrows */}
      <button
        type="button"
        onClick={() => go(-1)}
        aria-label="Previous slide"
        className="absolute top-1/2 left-4 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-cream/30 bg-black/20 text-cream backdrop-blur-sm transition-colors hover:bg-black/40"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => go(1)}
        aria-label="Next slide"
        className="absolute top-1/2 right-4 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-cream/30 bg-black/20 text-cream backdrop-blur-sm transition-colors hover:bg-black/40"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2.5">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === index}
            className={`h-2.5 rounded-full transition-all ${
              i === index ? "w-7 bg-marigold" : "w-2.5 bg-cream/50 hover:bg-cream/80"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
