import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/layout/page-header";
import { LoginForm } from "@/components/panels/login-form";

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const p = await getTranslations("pages");
  const l = await getTranslations("login");
  const n = await getTranslations("nav");

  return (
    <>
      <PageHeader title={p("loginTitle")} subtitle={p("loginSubtitle")} />
      <LoginForm
        note={l("note")}
        emailLabel={l("emailLabel")}
        passwordLabel={l("passwordLabel")}
        button={l("button")}
        noAccount={l("noAccount")}
        joinCta={n("join")}
      />
    </>
  );
}
