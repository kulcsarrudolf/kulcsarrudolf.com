import { Link } from "@tanstack/react-router";

import { useLangSearch } from "@/i18n/useLangSearch";
import { useTranslation } from "@/i18n/useTranslation";

import { DESTINATIONS } from "./commands";
import { ArrowIcon } from "./icons";

/**
 * The "Where next?" line: the three pages the terminal points at. The links
 * are one group, so on a phone the label keeps its own line rather than
 * sharing it with whichever link happens to fit.
 */
const WhereNext = () => {
  const { t } = useTranslation();
  const langSearch = useLangSearch();

  return (
    <div className="flex flex-wrap items-center gap-x-7 pl-[34px] text-gray-300">
      <span className="min-h-11 leading-11">{t("terminal.whereNext")}</span>
      <ul className="flex flex-wrap items-center gap-x-5 sm:gap-x-7">
        {DESTINATIONS.map(({ to, label }) => (
          <li key={to}>
            <Link
              to={to}
              search={langSearch}
              className="inline-flex min-h-11 items-center gap-1.5 text-blue-300 underline underline-offset-[3px] transition-colors hover:text-white"
              activeProps={{}}
              inactiveProps={{}}
            >
              <ArrowIcon />
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WhereNext;
