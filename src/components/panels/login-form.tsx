import { Link } from "@/i18n/navigation";

/**
 * LoginForm — a placeholder member-login card. The form is visual only;
 * real authentication arrives with the backend (Phase 2). No data is submitted.
 */
export function LoginForm({
  note,
  emailLabel,
  passwordLabel,
  button,
  noAccount,
  joinCta,
}: {
  note: string;
  emailLabel: string;
  passwordLabel: string;
  button: string;
  noAccount: string;
  joinCta: string;
}) {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-md px-6">
        <div className="rounded-2xl border border-border bg-cream p-8 shadow-sm">
          <p className="mb-6 rounded-lg bg-marigold/15 px-4 py-3 text-sm text-foreground">
            {note}
          </p>

          <div className="flex flex-col gap-4 opacity-70">
            <label className="flex flex-col gap-1.5 text-sm font-medium text-foreground">
              {emailLabel}
              <input
                type="email"
                disabled
                placeholder="you@example.com"
                className="rounded-lg border border-border bg-background px-3 py-2.5 text-sm"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm font-medium text-foreground">
              {passwordLabel}
              <input
                type="password"
                disabled
                placeholder="••••••••"
                className="rounded-lg border border-border bg-background px-3 py-2.5 text-sm"
              />
            </label>
            <button
              type="button"
              disabled
              className="mt-1 cursor-not-allowed rounded-full bg-bd-green/60 px-6 py-2.5 font-medium text-cream"
            >
              {button}
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {noAccount}{" "}
            <Link
              href="/join"
              className="font-medium text-brand-blue underline-offset-4 hover:underline"
            >
              {joinCta}
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
