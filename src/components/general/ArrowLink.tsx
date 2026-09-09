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
  "group -ml-3 inline-flex items-start gap-2 rounded-md px-3 py-3 text-sm font-medium text-brand transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand";

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

type ArrowLinkProps = LinkProps & {
  direction?: keyof typeof PATHS;
  children: ReactNode;
  className?: string;
};

const ArrowLink = ({
  direction = "forward",
  children,
  className = "",
  ...linkProps
}: ArrowLinkProps) => (
  <Link {...linkProps} className={`${LINK} ${className}`.trim()}>
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
