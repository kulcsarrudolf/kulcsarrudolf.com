import { Link } from "@tanstack/react-router";
import { useCallback, useState } from "react";

import useLangSearch from "@/i18n/useLangSearch";

import NavbarData from "./data";
import NavbarAvatar from "./NavbarAvatar";
import WelcomeModal from "./WelcomeModal";

interface BrandProps {
  /** Inside the white menu sheet the name is dark and the ring is blue. */
  tone?: "onBrand" | "onSurface";
  onNavigate?: () => void;
}

/**
 * Identity, set one step quieter than the navigation beside it. This is a real
 * link rather than a div with an onClick, so it is keyboard reachable, opens in
 * a new tab on cmd-click, and keeps the `?lang` the visitor chose.
 *
 * The avatar's easter egg lives here rather than in NavbarAvatar because the
 * modal has to sit outside the link. Rendered inside it, every click in the
 * modal (Play Sudoku, a board cell, the backdrop) also lands on the anchor and
 * the browser follows the href, which reloads the page out from under the game.
 */
const Brand = ({ tone = "onBrand", onNavigate }: BrandProps) => {
  const langSearch = useLangSearch();
  const { title, logoSrc } = NavbarData;
  const [isEggOpen, setIsEggOpen] = useState(false);

  const openEgg = useCallback(() => setIsEggOpen(true), []);
  const closeEgg = useCallback(() => setIsEggOpen(false), []);

  return (
    <>
      <Link
        to="/"
        search={langSearch}
        onClick={onNavigate}
        className="flex shrink-0 items-center rounded-lg"
        aria-label={title}
      >
        <NavbarAvatar
          src={logoSrc}
          alt={title}
          ringClassName={tone === "onBrand" ? "border-white" : "border-brand"}
          isRevealed={isEggOpen}
          onReveal={openEgg}
        />
        <span
          className={`whitespace-nowrap text-base font-semibold sm:text-lg ${
            tone === "onBrand" ? "text-white" : "text-gray-800"
          }`}
        >
          {title}
        </span>
      </Link>

      {isEggOpen && <WelcomeModal onClose={closeEgg} />}
    </>
  );
};

export default Brand;
