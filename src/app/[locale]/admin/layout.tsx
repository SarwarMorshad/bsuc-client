import { setRequestLocale } from "next-intl/server";
import { AdminGuard } from "@/components/admin/admin-guard";

/**
 * The admin area renders its own chrome (sidebar and top bar), so it opts out
 * of the public site header and footer — each page supplies its own AdminShell.
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

  return <AdminGuard>{children}</AdminGuard>;
}
