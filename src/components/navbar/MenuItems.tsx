"use client";

import { NAVBAR_ELEMENTS } from "./navber-links";
import NavbarElement from "@/types/navbar-element.type";
import Link from "next/link";
import { useTranslation } from "@/i18n/useTranslation";

interface MenuItemsProps {
  onClick: () => void;
}
const MenuItems = ({ onClick }: MenuItemsProps) => {
  const { t, lang } = useTranslation();

  const getTranslatedTitle = (title: string) => {
    const titleMap: Record<string, string> = {
      "Home": t("nav.home") as string,
      "Blog": t("nav.blog") as string,
      "Projects": t("nav.projects") as string,
      "Résumé": t("nav.resume") as string,
      "Contact": t("nav.contact") as string,
    };
    return titleMap[title] || title;
  };

  const getHrefWithLang = (href: string) => {
    // Don't add lang to external links
    if (href.startsWith("http")) {
      return href;
    }
    // Add lang query param to internal links if not default
    if (lang !== "en") {
      return `${href}?lang=${lang}`;
    }
    return href;
  };

  return (
    <ul className="flex flex-col font-medium md:flex-row md:align-middle md:space-x-4">
      {NAVBAR_ELEMENTS.map((element: NavbarElement) => (
        <Link
          key={element.title}
          href={getHrefWithLang(element.href)}
          target={element.openInNewTab ? "_blank" : "_self"}
          onClick={onClick}
          className="mb-4 md:mb-0"
        >
          <p className="text-white hover:font-bold">{getTranslatedTitle(element.title)}</p>
        </Link>
      ))}
    </ul>
  );
};

export default MenuItems;
