import { useTranslation } from "@/i18n/useTranslation";

import MessageNote from "./MessageNote";
import Prompt from "./Prompt";
import type { EntryResult, Step } from "./sendMessage";
import WeddingLine from "./WeddingLine";
import WhereNext from "./WhereNext";

interface TerminalEntryProps {
  /** What was typed. Empty for a bare Return, which prints only the prompt. */
  command: string;
  /** The `send-message` question the line answered, shown in place of the prompt. */
  prompt?: Step;
  /** Printed by the terminal on its own, so there is no prompt line to echo. */
  silent?: boolean;
  result: EntryResult;
  /** Ends the loving atmosphere. Only the newest wedding entry is given one. */
  onStopAtmosphere?: () => void;
}

/** One line of output, indented under the prompt like a real shell's. */
const Output = ({ children }: { children: React.ReactNode }) => (
  <p className="pl-[34px] text-gray-300" style={{ textWrap: "pretty" }}>
    {children}
  </p>
);

/**
 * One run command in the terminal's history: the prompt line echoing what was
 * typed, then whatever it printed. `clear` never reaches here, since it
 * empties the history instead of joining it.
 */
const TerminalEntry = ({
  command,
  prompt,
  silent = false,
  result,
  onStopAtmosphere,
}: TerminalEntryProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-2.5">
      {!silent && (
        <p className="flex gap-2.5">
          <Prompt label={prompt && (t(`terminal.message.prompt.${prompt}`) as string)} />
          {command && <span className="break-all text-white">{command}</span>}
        </p>
      )}

      {result.kind === "intro" && (
        <>
          <Output>{t("terminal.intro")}</Output>
          <WhereNext />
        </>
      )}
      {result.kind === "list" && <WhereNext />}
      {result.kind === "wedding" && <WeddingLine onStop={onStopAtmosphere} />}
      {result.kind === "sudoku" && <Output>{t("terminal.sudoku")}</Output>}
      {result.kind === "help" && <Output>{t("terminal.help")}</Output>}
      {result.kind === "sendMessage" && <Output>{t("terminal.message.start")}</Output>}
      {result.kind === "message" && <MessageNote note={result.note} />}
      {result.kind === "navigate" && (
        <Output>{t("terminal.opening", { page: result.destination.label })}</Output>
      )}
      {result.kind === "notFound" && (
        <Output>{t("terminal.notFound", { command: result.command })}</Output>
      )}
    </div>
  );
};

export default TerminalEntry;
