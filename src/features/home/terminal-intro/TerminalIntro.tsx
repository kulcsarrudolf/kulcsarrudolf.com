import { Link } from "@tanstack/react-router";

import { useLangSearch } from "@/i18n/useLangSearch";
import { useTranslation } from "@/i18n/useTranslation";

import { ArrowIcon } from "./icons";

// The three places the intro points at. The labels are paths rather than
// copy, so they are the same in every language.
const DESTINATIONS = [
  { to: "/blog", label: "blog/" },
  { to: "/projects", label: "projects/" },
  { to: "/contact", label: "contact/" },
] as const;

/** The shell prompt, hidden from screen readers: it is decoration around the line. */
const Prompt = () => (
  <span className="text-blue-300" aria-hidden="true">
    ~ $
  </span>
);

/**
 * The block that opens the home page: a terminal window in which `./intro.sh`
 * has just printed who I am and where to go next.
 *
 * Sits between the navbar and About Me. It is the one dark object on the page,
 * a counterweight to the brand-blue Let's Talk band further down, and it says
 * "developer" before a single paragraph is read. Everything in it is text, so
 * the copy lives in the translation files with the rest of the page.
 */
const TerminalIntro = () => {
  const { t } = useTranslation();
  const langSearch = useLangSearch();

  return (
    <section
      aria-label={t("home.terminalIntro.label") as string}
      className="overflow-hidden rounded-xl bg-gray-800 shadow-md"
    >
      <div
        className="flex h-10 items-center gap-2 border-b border-white/10 bg-gray-700 px-4"
        aria-hidden="true"
      >
        <span className="h-3 w-3 rounded-full bg-gray-500" />
        <span className="h-3 w-3 rounded-full bg-gray-500" />
        <span className="h-3 w-3 rounded-full bg-gray-500" />
        <span className="ml-2 font-mono text-[13px] text-gray-400">~/kulcsarrudolf.com</span>
      </div>

      <div className="flex flex-col gap-2.5 px-4 pb-6 pt-5 font-mono text-[15px] leading-[1.6] sm:px-6">
        <p className="flex gap-2.5">
          <Prompt />
          <span className="text-white">./intro.sh</span>
        </p>

        <p className="pl-[34px] text-gray-300" style={{ textWrap: "pretty" }}>
          {t("home.terminalIntro.intro")}
        </p>

        {/* The links are one group, so on a phone the label keeps its own line
            rather than sharing it with whichever link happens to fit. */}
        <div className="flex flex-wrap items-center gap-x-7 pl-[34px] text-gray-300">
          <span className="min-h-11 leading-11">{t("home.terminalIntro.whereNext")}</span>
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

        <p className="flex gap-2.5" aria-hidden="true">
          <Prompt />
          <span className="mt-[3px] inline-block h-[18px] w-[9px] bg-white animate-blink motion-reduce:animate-none" />
        </p>
      </div>
    </section>
  );
};

export default TerminalIntro;
