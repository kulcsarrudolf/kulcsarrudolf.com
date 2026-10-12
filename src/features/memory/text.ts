import type { ReactNode } from "react";

/**
 * A translation as plain text, for an attribute or a prop that takes a
 * string. A translation with placeholders comes back from `t` in pieces, one
 * per segment, which an `aria-label` would otherwise print with commas.
 */
export const asText = (value: string | ReactNode[]): string =>
  typeof value === "string" ? value : value.join("");
