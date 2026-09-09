import type { FileRouteTypes } from "@/routeTree.gen";

// Internal entries must be a real route so the navbar links stay type-checked;
// external entries are plain absolute URLs.
export default interface NavbarElement {
  /** Translation key, e.g. `nav.home`. The label is never hardcoded English. */
  labelKey: string;
  href: FileRouteTypes["to"] | `https://${string}`;
  openInNewTab?: boolean;
  /**
   * Extra path prefixes that should mark this entry as the current page.
   * Blog needs it because posts live at `/posts/<slug>`, not under `/blog`.
   */
  matchPrefixes?: string[];
  /** Rendered as the filled call to action rather than a plain link. */
  cta?: boolean;
}
