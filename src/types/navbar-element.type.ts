import type { FileRouteTypes } from "@/routeTree.gen";

// Internal entries must be a real route so the navbar links stay type-checked;
// external entries are plain absolute URLs.
export default interface NavbarElement {
  title: string;
  href: FileRouteTypes["to"] | `https://${string}`;
  openInNewTab?: boolean;
}
