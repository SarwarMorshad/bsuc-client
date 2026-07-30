import { getTranslations } from "next-intl/server";

/** Route-level loading fallback: a stitched spinner shown while a page streams in. */
export default async function Loading() {
  const t = await getTranslations("states");

  return (
    <div
      className="flex min-h-[70vh] flex-col items-center justify-center gap-4"
      role="status"
      aria-live="polite"
    >
      <svg
        className="h-10 w-10 animate-spin text-madder"
        viewBox="0 0 50 50"
        aria-hidden="true"
      >
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeDasharray="8 7"
          strokeLinecap="round"
          opacity="0.85"
        />
      </svg>
      <span className="text-sm tracking-wide text-muted-foreground">
        {t("loading")}
      </span>
    </div>
  );
}
