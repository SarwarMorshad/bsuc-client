/** A plain nav entry, or one that opens a small menu of its own. */
export type NavLink =
  | { href: string; label: string; children?: never }
  | {
      label: string;
      href?: never;
      children: { href: string; label: string; hint?: string }[];
    };
