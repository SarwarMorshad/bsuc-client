import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { buildMetadata } from "@/lib/metadata";
import { ProfileView } from "@/components/profile/profile-view";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "profile" });
  return buildMetadata({
    locale,
    path: "/profile",
    title: t("title"),
    description: t("subtitle"),
  });
}

/** Member's own profile. Signed-out visitors are redirected by the route guard. */
export default async function ProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <section className="mx-auto max-w-3xl px-6 py-14 sm:py-20">
      <ProfileView />
    </section>
  );
}
