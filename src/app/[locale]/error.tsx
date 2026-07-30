"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { StateMessage } from "@/components/layout/state-message";

/**
 * Route-level error boundary. Next 16 passes `unstable_retry` (formerly
 * `reset`), which re-fetches and re-renders this boundary's children.
 */
export default function ErrorPage({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  const t = useTranslations("states");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <StateMessage title={t("errorTitle")} body={t("errorBody")}>
      <button
        type="button"
        onClick={() => unstable_retry()}
        className="rounded-full bg-bd-green px-7 py-3 font-medium text-cream shadow-sm transition-transform hover:scale-[1.03]"
      >
        {t("errorRetry")}
      </button>
      <Link
        href="/"
        className="rounded-full border border-indigo/40 px-7 py-3 font-medium text-indigo transition-colors hover:bg-indigo/5"
      >
        {t("errorHome")}
      </Link>
    </StateMessage>
  );
}
