"use client";

import { useTranslations } from "next-intl";
import {
  PASSWORD_RULES,
  passwordScore,
} from "@/lib/password-rules";

function Check({ met }: { met: boolean }) {
  return (
    <span
      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full transition-colors ${
        met ? "bg-bd-green text-cream" : "bg-muted/50 text-muted-foreground"
      }`}
      aria-hidden="true"
    >
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
        {met ? <path d="M20 6L9 17l-5-5" /> : <circle cx="12" cy="12" r="6" />}
      </svg>
    </span>
  );
}

/**
 * Live password feedback: a strength meter plus a checklist that ticks off each
 * requirement as the member types. Announced politely so screen-reader users
 * hear the strength change without being interrupted on every keystroke.
 */
export function PasswordRequirements({ value }: { value: string }) {
  const f = useTranslations("form");
  const total = PASSWORD_RULES.length;
  const score = passwordScore(value);

  const label =
    score <= 2 ? f("pwWeak") : score < total ? f("pwFair") : f("pwStrong");
  const barColor =
    score <= 2 ? "bg-madder" : score < total ? "bg-marigold" : "bg-bd-green";

  return (
    <div className="flex flex-col gap-2.5 rounded-lg border border-dashed border-border bg-cream/60 p-3">
      {/* Strength meter */}
      <div className="flex items-center gap-2">
        <div className="flex flex-1 gap-1" aria-hidden="true">
          {PASSWORD_RULES.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i < score ? barColor : "bg-muted/40"
              }`}
            />
          ))}
        </div>
        <span aria-live="polite" className="text-xs font-medium text-muted-foreground">
          {value ? label : ""}
        </span>
      </div>

      <p className="text-xs text-muted-foreground">{f("pwRequirements")}</p>

      <ul className="flex flex-col gap-1.5">
        {PASSWORD_RULES.map((rule) => {
          const met = rule.test(value);
          return (
            <li key={rule.key} className="flex items-center gap-2 text-xs">
              <Check met={met} />
              <span className={met ? "text-foreground" : "text-muted-foreground"}>
                {f(rule.key)}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
