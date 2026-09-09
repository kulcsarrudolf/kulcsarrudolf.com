import { Link } from "@tanstack/react-router";

import { useTranslation } from "@/i18n/useTranslation";
import type NavbarElement from "@/types/navbar-element.type";

import { NAVBAR_ELEMENTS } from "./navber-links";

interface MenuItemsProps {
  onClick: () => void;
}

const isExternal = (href: NavbarElement["href"]): href is `https://${string}` =>
  href.startsWith("http");

const MenuItems = ({ onClick }: MenuItemsProps) => {
  const { t, lang } = useTranslation();

  const getTranslatedTitle = (title: string) => {
    const titleMap: Record<string, string> = {
      Home: t("nav.home") as string,
      Blog: t("nav.blog") as string,
      Projects: t("nav.projects") as string,
      "Résumé": t("nav.resume") as string,
      Contact: t("nav.contact") as string,
    };
    return titleMap[title] || title;
  };

  const linkClassName = "mb-4 md:mb-0 flex items-center";

  return (
    <ul className="flex flex-col font-medium md:flex-row md:items-center md:space-x-4">
      {NAVBAR_ELEMENTS.map((element) => {
        const isContact = element.title === "Contact";
        const label = (
          <p
            className={
              isContact
                ? "text-blue-600 bg-white px-3 py-1 rounded-md hover:font-bold"
                : "text-white hover:font-bold py-1"
            }
          >
            {getTranslatedTitle(element.title)}
          </p>
        );

        // External links never carry the lang query param.
        if (isExternal(element.href)) {
          return (
            <a
              key={element.title}
              href={element.href}
              target={element.openInNewTab ? "_blank" : "_self"}
              rel={element.openInNewTab ? "noopener noreferrer" : undefined}
              onClick={onClick}
              className={linkClassName}
            >
              {label}
            </a>
          );
        }

        return (
          <Link
            key={element.title}
            to={element.href}
            // Keep the chosen language across internal navigation.
            search={{ lang: lang !== "en" ? lang : undefined }}
            target={element.openInNewTab ? "_blank" : "_self"}
            onClick={onClick}
            className={linkClassName}
          >
            {label}
          </Link>
        );
      })}
    </ul>
  );
};

export default MenuItems;
