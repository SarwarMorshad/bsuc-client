import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

/**
 * Next.js 16 "proxy" (formerly middleware). next-intl's handler detects the
 * locale, redirects to a prefixed path when needed, and sets the locale cookie.
 */
export default createMiddleware(routing);

export const config = {
  // Run on all paths except API, Next internals, and files with an extension.
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
