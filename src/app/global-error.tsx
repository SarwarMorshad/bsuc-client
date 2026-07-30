"use client";

import { useEffect } from "react";
import "./globals.css";

/**
 * Last-resort error boundary for failures in the root layout itself. It
 * replaces the layout, so it must render its own <html>/<body> and cannot use
 * the i18n provider — the copy here stays in English by necessity.
 */
export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-background px-6">
        <title>Something went wrong</title>
        <div className="flex max-w-md flex-col items-center gap-5 text-center">
          <h1 className="font-display text-3xl font-semibold text-foreground">
            Something went wrong
          </h1>
          <p className="leading-relaxed text-muted-foreground">
            An unexpected error occurred. Please try again.
          </p>
          <button
            type="button"
            onClick={() => unstable_retry()}
            className="rounded-full bg-bd-green px-7 py-3 font-medium text-cream shadow-sm"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
