import { useTranslation } from "@/i18n/useTranslation";

interface CommandsTipProps {
  /** Runs `commands`. Without it, as while a question is open, the word is plain text. */
  onRun?: () => void;
}

/**
 * The line under the intro that points a newcomer at `commands`, set apart in
 * the terminal's blue so it is the first thing read after the greeting. The
 * word itself runs the command, for a visitor who would rather click than type.
 */
const CommandsTip = ({ onRun }: CommandsTipProps) => {
  const { t } = useTranslation();

  const command = onRun ? (
    <button
      type="button"
      onClick={onRun}
      className="cursor-pointer font-bold text-brand-on-dark underline underline-offset-[3px] transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-on-dark"
    >
      commands
    </button>
  ) : (
    <strong className="font-bold text-brand-on-dark">commands</strong>
  );

  return (
    <p
      className="ml-[34px] w-fit rounded-md border border-brand-on-dark/60 bg-brand-on-dark/10 px-3 py-1.5 text-gray-100"
      style={{ textWrap: "pretty" }}
    >
      {t("terminal.tip", { command })}
    </p>
  );
};

export default CommandsTip;
