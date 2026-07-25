import { setRequestLocale } from "next-intl/server";
import { AuthFlip } from "@/components/auth/auth-flip";

export default async function JoinPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AuthFlip initial="join" />;
}
