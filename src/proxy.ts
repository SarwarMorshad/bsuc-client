import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const handleI18n = createMiddleware(routing);

/** Session cookie set by bsuc-server on sign-in. */
const AUTH_COOKIE = "bsuc_token";

/** Routes that require a signed-in member, without the locale prefix. */
const PROTECTED = ["/jobs", "/dashboard", "/profile", "/admin"];

/**
 * Carved out of the rules above. /jobs is members-only, but the form employers
 * use to submit a listing sits underneath it and has to stay open — asking a
 * company to register an account first is exactly the friction this avoids.
 */
const PUBLIC_EXCEPTIONS = ["/jobs/post"];

/** Strips a leading locale segment so paths can be matched consistently. */
function stripLocale(pathname: string) {
  for (const locale of routing.locales) {
    if (pathname === `/${locale}`) return "/";
    if (pathname.startsWith(`/${locale}/`))
      return pathname.slice(locale.length + 1);
  }
  return pathname;
}

/**
 * Next.js 16 "proxy" (formerly middleware): resolves the locale, then guards
 * member-only routes.
 *
 * The guard here only checks that a session cookie is present, which is enough
 * to send signed-out visitors to the login page cheaply and keep the ?next
 * parameter. It deliberately does not verify the token: that would mean
 * duplicating the secret and the role lookup at the edge.
 *
 * Authorisation happens twice behind it, both authoritative:
 *  - server-side in the admin layout and /jobs, via getServerUser(), so a
 *    forged cookie never gets the page rendered;
 *  - on every API request, which verifies the JWT and reads the current role
 *    from the database.
 */
export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const path = stripLocale(pathname);

  const isProtected =
    PROTECTED.some((p) => path === p || path.startsWith(`${p}/`)) &&
    !PUBLIC_EXCEPTIONS.some((p) => path === p || path.startsWith(`${p}/`));

  if (isProtected && !request.cookies.get(AUTH_COOKIE)) {
    const url = request.nextUrl.clone();
    // Keep the locale prefix so the member stays in their language.
    const prefix = pathname.slice(0, pathname.length - path.length);
    url.pathname = `${prefix}/login`;
    url.search = `?next=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(url);
  }

  return handleI18n(request);
}

export const config = {
  // Run on all paths except API, Next internals, and files with an extension.
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
