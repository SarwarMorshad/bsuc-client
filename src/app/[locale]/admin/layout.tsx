import { setRequestLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { AdminGuard } from "@/components/admin/admin-guard";
import { getServerUser } from "@/lib/server-auth";

/**
 * The admin area renders its own chrome (sidebar and top bar), so it opts out
 * of the public site header and footer — each page supplies its own AdminShell.
 *
 * Access is checked here, on the server, so a non-admin never receives the
 * dashboard at all. AdminGuard still runs underneath to cover client-side
 * navigation, and every admin endpoint checks the role again itself.
 */
export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const user = await getServerUser();
  if (!user) {
    redirect({ href: "/login", locale });
  } else if (user.role !== "ADMIN") {
    // Signed in, wrong role — send them somewhere they can actually use.
    redirect({ href: "/", locale });
  }

  return <AdminGuard>{children}</AdminGuard>;
}
