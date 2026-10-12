import { useTranslation } from "@/i18n/useTranslation";

import { helpLines } from "./commands";

const LINES = helpLines();

/**
 * What `help` and `commands` print: a heading, then one command per line, its
 * names in bold and what it does in italics, and the way to open a page last.
 */
const HelpList = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-1 pl-[34px] text-gray-300">
      <p>{t("terminal.help.title")}</p>
      <ul className="flex flex-col gap-1">
        {LINES.map(({ names, kind }) => (
          <li key={kind} className="flex flex-wrap gap-x-3">
            <span className="font-bold text-white">{names.join(", ")}</span>
            <span className="italic text-gray-400">{t(`terminal.complete.hint.${kind}`)}</span>
          </li>
        ))}
      </ul>
      <p style={{ textWrap: "pretty" }}>{t("terminal.help.pages")}</p>
    </div>
  );
};

export default HelpList;
