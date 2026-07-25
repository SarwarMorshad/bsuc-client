import { setRequestLocale } from "next-intl/server";

/** Route marker — the (auth) layout renders the slider based on the URL. */
export default async function JoinPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return null;
}
