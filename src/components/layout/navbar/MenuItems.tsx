import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { useLangSearch } from "@/i18n/useLangSearch";
import { useTranslation } from "@/i18n/useTranslation";
import type { NavbarElement } from "./types";

import { NAVBAR_ELEMENTS } from "./navbar-links";

/**
 * `bar` is the horizontal list inside the blue bar; `sheet` is the stacked
 * full-width list inside the mobile menu. The link set is identical, so it
 * lives here once and only the presentation branches.
 */
type MenuVariant = "bar" | "sheet";

interface MenuItemsProps {
  variant?: MenuVariant;
  onNavigate?: () => void;
}

const isExternal = (href: NavbarElement["href"]): href is `https://${string}` =>
  href.startsWith("http");

const under = (pathname: string, base: string) =>
  pathname === base || pathname.startsWith(`${base}/`);

/**
 * One rule for the current page, rather than leaning on the router's own
 * matching. "/" has to be exact or it matches everything, and Blog has to cover
 * `/posts/<slug>`, which is not nested under `/blog` at all.
 */
const isCurrent = (element: NavbarElement, pathname: string) => {
  if (isExternal(element.href)) return false;
  if (element.href === "/") return pathname === "/";
  if (under(pathname, element.href)) return true;
  return (element.matchPrefixes ?? []).some((prefix) => under(pathname, prefix));
};

// The current entry carries `data-status="active"`, so it styles itself in CSS.
// The box is deliberately identical in both states: the padding is always on
// and `nav-label` reserves the width of the bold text, so only colour and
// weight react to `data-status` and the row never shifts on navigation.
const BAR_LINK =
  "flex min-h-11 items-center rounded-md px-3 py-1 text-white transition-colors hover:text-white/75 data-[status=active]:bg-brand-active data-[status=active]:font-semibold data-[status=active]:text-white data-[status=active]:hover:text-white dark:data-[status=active]:bg-brand-dark-active";

const BAR_CTA =
  "flex min-h-11 items-center rounded-md bg-white px-3 py-1 font-medium text-brand transition-colors hover:bg-white/90";

// 48px keeps the row above the 44px target floor while reading tighter than
// the 56px it started at.
const SHEET_LINK =
  "flex min-h-12 w-full items-center rounded-lg px-3 text-base font-semibold text-gray-800 transition-colors hover:bg-gray-100 data-[status=active]:bg-brand data-[status=active]:text-white data-[status=active]:hover:bg-brand dark:text-gray-100 dark:hover:bg-fill-dark dark:data-[status=active]:bg-brand-dark dark:data-[status=active]:hover:bg-brand-dark";

const SHEET_CTA =
  "flex min-h-12 w-full items-center justify-center rounded-lg bg-brand px-3 text-base font-semibold text-white transition-colors hover:bg-brand-hover dark:bg-brand-dark dark:hover:bg-brand-dark-active";

const MenuItems = ({ variant = "bar", onNavigate }: MenuItemsProps) => {
  const { t } = useTranslation();
  const langSearch = useLangSearch();
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  const classNameFor = (element: NavbarElement) => {
    if (variant === "sheet") return element.cta ? SHEET_CTA : SHEET_LINK;
    return element.cta ? BAR_CTA : BAR_LINK;
  };

  // In the bar the links only appear once they fit: the call to action from
  // `socials` up, the rest from `nav` up. In the sheet everything is visible.
  const itemClassName = (element: NavbarElement) => {
    if (variant === "sheet") {
      // A hairline separates the call to action from the navigation above it,
      // so it reads as a button rather than a fourth destination.
      return element.cta
        ? "mt-5 w-full border-t border-gray-200 pt-5 dark:border-line-dark"
        : "w-full";
    }
    // The call to action carries its own padding, so it needs a little more
    // room than the tightened gap gives it to clear the active pill.
    return element.cta ? "hidden socials:ml-3 socials:block" : "hidden nav:block";
  };

  const renderLink = (element: NavbarElement): ReactNode => {
    const label = t(element.labelKey) as string;
    const className = classNameFor(element);
    // Only the bar links change weight, so only they need the reserved width.
    const labelNode =
      variant === "bar" && !element.cta ? (
        <span className="nav-label" data-label={label}>
          {label}
        </span>
      ) : (
        label
      );
    const target = element.openInNewTab ? "_blank" : undefined;
    const current = isCurrent(element, pathname);
    const currentProps = current
      ? { "data-status": "active", "aria-current": "page" as const }
      : {};

    // External links never carry the lang query param.
    if (isExternal(element.href)) {
      return (
        <a
          href={element.href}
          target={target}
          rel={element.openInNewTab ? "noopener noreferrer" : undefined}
          onClick={onNavigate}
          className={className}
        >
          {labelNode}
        </a>
      );
    }

    return (
      <Link
        to={element.href}
        search={langSearch}
        target={target}
        onClick={onNavigate}
        className={className}
        // The router's own active matching is off: it would treat a different
        // `?lang` as a different page, and it cannot know about /posts.
        activeProps={{}}
        inactiveProps={{}}
        {...currentProps}
      >
        {labelNode}
      </Link>
    );
  };

  return (
    <ul
      className={variant === "sheet" ? "flex w-full flex-col gap-1.5" : "flex items-center gap-1"}
    >
      {NAVBAR_ELEMENTS.map((element) => (
        <li key={element.labelKey} className={itemClassName(element)}>
          {renderLink(element)}
        </li>
      ))}
    </ul>
  );
};

export default MenuItems;
