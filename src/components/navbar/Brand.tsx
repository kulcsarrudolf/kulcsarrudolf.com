import { Link } from "@tanstack/react-router";

import { useTranslation } from "@/i18n/useTranslation";

import NavbarData from "./data";
import NavbarAvatar from "./NavbarAvatar";

interface BrandProps {
  /** Inside the white menu sheet the name is dark and the ring is blue. */
  tone?: "onBrand" | "onSurface";
  onNavigate?: () => void;
}

/**
 * Identity, set one step quieter than the navigation beside it. This is a real
 * link rather than a div with an onClick, so it is keyboard reachable, opens in
 * a new tab on cmd-click, and keeps the `?lang` the visitor chose.
 */
const Brand = ({ tone = "onBrand", onNavigate }: BrandProps) => {
  const { lang } = useTranslation();
  const { title, logoSrc } = NavbarData;

  return (
    <Link
      to="/"
      search={{ lang: lang !== "en" ? lang : undefined }}
      onClick={onNavigate}
      className="flex shrink-0 items-center rounded-lg"
      aria-label={title}
    >
      <NavbarAvatar
        src={logoSrc}
        alt={title}
        ringClassName={tone === "onBrand" ? "border-white" : "border-brand"}
      />
      <span
        className={`whitespace-nowrap text-lg font-semibold ${
          tone === "onBrand" ? "text-white" : "text-gray-800"
        }`}
      >
        {title}
      </span>
    </Link>
  );
};

export default Brand;
