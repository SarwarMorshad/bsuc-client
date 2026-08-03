import { Suspense } from "react";
import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { buildMetadata } from "@/lib/metadata";
import { VerifyEmail } from "@/components/auth/verify-email";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "verify" });
  return buildMetadata({
    locale,
    path: "/verify",
    title: t("title"),
    description: t("body", { email: "" }),
  });
}

/** Target of the link in the verification email. */
export default async function VerifyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <section className="flex min-h-[70vh] items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        {/* useSearchParams needs a Suspense boundary. */}
        <Suspense fallback={null}>
          <VerifyEmail />
        </Suspense>
      </div>
    </section>
  );
}
