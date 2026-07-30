import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { StateMessage } from "@/components/layout/state-message";

/** 404 page for unmatched routes inside a locale. */
export default async function NotFound() {
  const t = await getTranslations("states");

  return (
    <StateMessage code="404" title={t("notFoundTitle")} body={t("notFoundBody")}>
      <Link
        href="/"
        className="rounded-full bg-bd-green px-7 py-3 font-medium text-cream shadow-sm transition-transform hover:scale-[1.03]"
      >
        {t("notFoundCta")}
      </Link>
    </StateMessage>
  );
}
