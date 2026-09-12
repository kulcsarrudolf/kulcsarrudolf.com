import { Link, type LinkProps } from "@tanstack/react-router";
import type { ReactNode } from "react";

/**
 * A router link led by a small arrow, used for the related-posts list and the
 * "back to all projects" link under a project.
 *
 * The negative margin cancels the padding so the arrow sits on the body text's
 * left edge, letting the icons read as list markers while the padded hit area
 * stays comfortably large.
 */
const LINK =
  "group -ml-3 inline-flex items-start gap-2 rounded-md px-3 py-3 text-sm font-medium text-brand transition-colors hover:bg-gray-100 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand dark:text-brand-on-dark dark:hover:bg-fill-dark dark:focus-visible:ring-brand-on-dark";

// mt centres the icon on the first line, so it stays put as a list marker when
// a long title wraps on narrow screens.
const ICON = "mt-[3px] h-3.5 w-3.5 shrink-0 transition-transform";

const PATHS = {
  forward: "M3 8h10M9 4l4 4-4 4",
  back: "M13 8H3M7 4l-4 4 4 4",
} as const;

// The arrow leans towards where it is pointing on hover.
const NUDGE = {
  forward: "group-hover:translate-x-0.5",
  back: "group-hover:-translate-x-0.5",
} as const;

// `className` is excluded rather than ignored: the router's own LinkProps
// declares one, and a caller passing it would otherwise be overruled by the
// class list below without ever being told.
type ArrowLinkProps = Omit<LinkProps, "className"> & {
  direction?: keyof typeof PATHS;
  children: ReactNode;
};

const ArrowLink = ({ direction = "forward", children, ...linkProps }: ArrowLinkProps) => (
  <Link {...linkProps} className={LINK}>
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${ICON} ${NUDGE[direction]}`}
    >
      <path d={PATHS[direction]} />
    </svg>
    {children}
  </Link>
);

export default ArrowLink;
