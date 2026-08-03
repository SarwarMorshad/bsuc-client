import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { AdminGuard } from "@/components/admin/admin-guard";
import { RunningStitch } from "@/components/motifs/running-stitch";

/** Shell for the admin area: heading, section nav and the role guard. */
export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin");

  return (
    <section className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
      <AdminGuard>
        <header className="flex flex-col gap-2">
          <h1 className="font-display text-3xl font-semibold text-foreground">
            {t("title")}
          </h1>
          <RunningStitch className="w-20 text-madder" />
          <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
        </header>

        <nav className="mt-6 flex gap-2 border-b border-border pb-3">
          <Link
            href="/admin/events"
            className="rounded-full bg-muted/30 px-4 py-1.5 text-sm font-medium text-foreground hover:bg-muted/50"
          >
            {t("events")}
          </Link>
        </nav>

        <div className="mt-8">{children}</div>
      </AdminGuard>
    </section>
  );
}
