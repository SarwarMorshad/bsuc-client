export type Event = {
  id: string;
  title: string;
  /** ISO timestamp. */
  date: string;
  location: string | null;
  description: string | null;
  imageUrl: string | null;
  imagePublicId: string | null;
  published: boolean;
  createdAt: string;
};

/**
 * Events for the public site, fetched on the server so the page is rendered
 * with real content rather than loading in the browser.
 *
 * The API base URL is read directly here because this runs server-side, where
 * the shared Axios instance's browser defaults do not apply.
 */
export async function getPublicEvents({ past = false } = {}): Promise<Event[]> {
  const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

  try {
    const res = await fetch(`${base}/events${past ? "?past=true" : ""}`, {
      // Events change rarely; revalidate so a newly published one appears
      // without a redeploy.
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { events: Event[] };
    return data.events;
  } catch {
    // A missing API should not break the page — the section shows an empty state.
    return [];
  }
}

/** Formats an event date in the reader's language. */
export function formatEventDate(iso: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}
