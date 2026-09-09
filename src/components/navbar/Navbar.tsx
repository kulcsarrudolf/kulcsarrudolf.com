import { useRouterState } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";

import { useTranslation } from "@/i18n/useTranslation";

import Brand from "./Brand";
import HamburgerButton from "./HamburgerButton";
import MenuItems from "./MenuItems";
import NavSheet from "./NavSheet";
import SocialMediaLinks from "./SocialMediaLinks";

const MENU_ID = "primary-navigation";
const DOCK_THRESHOLD = 100;

/**
 * One row, one rhythm. Identity is set a step quieter than the navigation so
 * the links lead, the call to action is the brightest object, and the social
 * icons sit behind a hairline as a footnote rather than as peers.
 *
 * What is visible depends on what fits, and the two breakpoints were measured:
 *   below 546px  brand + menu button
 *   546px+       adds the call to action, the divider and the social icons
 *   706px+       adds the full link list, and the menu button retires
 */
const Navbar = () => {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDocked, setIsDocked] = useState(false);

  const pathname = useRouterState({ select: (state) => state.location.pathname });

  const closeMenu = useCallback(() => setIsMenuOpen(false), []);

  // Navigating away closes the menu. This used to be spread across every link's
  // onClick; one effect on the route is both shorter and harder to forget.
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    let frame: number | null = null;

    const handleScroll = () => {
      if (frame !== null) return;

      frame = requestAnimationFrame(() => {
        frame = null;
        const docked = window.scrollY > DOCK_THRESHOLD;
        setIsDocked(docked);
        if (docked) setIsMenuOpen(false);
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <nav
      aria-label={t("nav.menu") as string}
      className={`fixed left-0 top-0 z-20 w-full px-2 transition-[margin] duration-200 ${
        isDocked ? "mt-0" : "mt-5"
      }`}
    >
      <div
        className={`mx-auto flex h-20 max-w-5xl items-center rounded-2xl bg-brand px-4 shadow-md ${
          isDocked ? "rounded-t-none" : ""
        }`}
      >
        <Brand />

        <div className="flex-1" />

        <MenuItems variant="bar" />

        <div
          className="mx-4 hidden h-6 w-px shrink-0 bg-white/25 socials:block"
          aria-hidden="true"
        />
        <SocialMediaLinks size="sm" className="hidden socials:flex" />

        <HamburgerButton
          className="ml-3 nav:hidden"
          isOpen={isMenuOpen}
          controls={MENU_ID}
          label={t("nav.openMenu") as string}
          onClick={() => setIsMenuOpen((open) => !open)}
        />
      </div>

      {isMenuOpen && <NavSheet id={MENU_ID} onClose={closeMenu} />}
    </nav>
  );
};

export default Navbar;
