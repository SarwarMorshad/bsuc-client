import { setRequestLocale, getTranslations } from "next-intl/server";
import { SmoothScroll } from "@/components/layout/smooth-scroll";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

/**
 * Chrome for the public site: header, footer and smooth scrolling. The admin
 * dashboard sits outside this group so it can use its own full-screen shell.
 */
export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tn = await getTranslations("nav");
  const navLinks = [
    { href: "/events", label: tn("events") },
    { href: "/new-students", label: tn("newStudents") },
    { href: "/gallery", label: tn("gallery") },
    // Jobs splits in two: employers submit without an account, members browse
    // the listings after signing in.
    {
      label: tn("jobs"),
      children: [
        {
          href: "/jobs/post",
          label: tn("forEmployers"),
          note: tn("forEmployersNote"),
        },
        { href: "/jobs", label: tn("forStudents") },
      ],
    },
  ];

  return (
    <SmoothScroll>
      <SiteHeader
        links={navLinks}
        joinLabel={tn("join")}
        loginLabel={tn("login")}
      />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </SmoothScroll>
  );
}
