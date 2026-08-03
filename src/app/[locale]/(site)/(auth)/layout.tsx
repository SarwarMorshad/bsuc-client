import { setRequestLocale } from "next-intl/server";
import { AuthSlide } from "@/components/auth/auth-slide";

/**
 * Shared layout for the auth routes (/login, /join). It renders the persistent
 * AuthSlide once, so navigating between login and join — from the nav buttons
 * or the in-form links — animates the same slider instead of remounting it.
 * The child pages themselves render nothing; the URL drives which screen shows.
 */
export default async function AuthLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      {children}
      <AuthSlide />
    </>
  );
}
