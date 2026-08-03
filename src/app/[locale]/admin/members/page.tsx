import { setRequestLocale, getTranslations } from "next-intl/server";
import { AdminShell } from "@/components/admin/admin-shell";
import { MembersManager } from "@/components/admin/members-manager";

export default async function AdminMembersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin");

  return (
    <AdminShell title={t("members")}>
      <MembersManager />
    </AdminShell>
  );
}
