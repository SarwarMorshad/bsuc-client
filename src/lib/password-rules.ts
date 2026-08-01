/**
 * Password policy, mirrored from the API (bsuc-server registerSchema). The
 * server is the authority — these rules exist so the UI can give live feedback
 * before the request is sent.
 */
export const PASSWORD_RULES = [
  { key: "pwLength", test: (v: string) => v.length >= 8 },
  { key: "pwLower", test: (v: string) => /[a-z]/.test(v) },
  { key: "pwUpper", test: (v: string) => /[A-Z]/.test(v) },
  { key: "pwNumber", test: (v: string) => /[0-9]/.test(v) },
  { key: "pwSpecial", test: (v: string) => /[^A-Za-z0-9]/.test(v) },
] as const;

export type PasswordRuleKey = (typeof PASSWORD_RULES)[number]["key"];

/** How many rules the value satisfies. */
export function passwordScore(value: string) {
  return PASSWORD_RULES.filter((r) => r.test(value)).length;
}

/** True once every rule passes. */
export function isPasswordValid(value: string) {
  return passwordScore(value) === PASSWORD_RULES.length;
}
