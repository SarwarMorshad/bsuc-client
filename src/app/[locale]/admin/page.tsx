import { redirect } from "@/i18n/navigation";

/** The admin root has nothing of its own yet — go straight to events. */
export default async function AdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect({ href: "/admin/events", locale });
}
