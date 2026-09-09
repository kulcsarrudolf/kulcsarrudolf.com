import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import type { RegisteredRouter } from "@tanstack/react-router";

// The `to` union of the registered router, reached through the `Register`
// interface in src/router.tsx rather than by importing the generated route tree.
type RouteTo = RegisteredRouter["routeTree"]["types"]["fileRouteTypes"]["to"];

// Internal entries must be a real route so the navbar links stay type-checked;
// external entries are plain absolute URLs.
export interface NavbarElement {
  /** Translation key, e.g. `nav.home`. The label is never hardcoded English. */
  labelKey: string;
  href: RouteTo | `https://${string}`;
  openInNewTab?: boolean;
  /**
   * Extra path prefixes that should mark this entry as the current page.
   * Blog needs it because posts live at `/posts/<slug>`, not under `/blog`.
   */
  matchPrefixes?: string[];
  /** Rendered as the filled call to action rather than a plain link. */
  cta?: boolean;
}

export interface SocialMediaLink {
  title: string;
  href: string;
  icon: IconDefinition;
}
