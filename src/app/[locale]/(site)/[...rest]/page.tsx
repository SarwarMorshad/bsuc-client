import { notFound } from "next/navigation";

/**
 * Catch-all for unmatched paths. Without it, unknown URLs never enter the
 * [locale] segment and Next renders its built-in 404 instead of our localised
 * not-found page (which needs the locale layout for header, footer and copy).
 */
export default function CatchAllNotFound() {
  notFound();
}
