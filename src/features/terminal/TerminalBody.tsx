import type { ChangeEvent, FormEvent, KeyboardEvent, MouseEvent, Ref } from "react";

import { useTranslation } from "@/i18n/useTranslation";

import Prompt from "./Prompt";
import TerminalEntry from "./TerminalEntry";
import type { TerminalEntry as Entry } from "./useTerminal";

interface TerminalBodyProps {
  entries: Entry[];
  /** The entry whose wedding block still has hearts over the page, if any. */
  atmosphereEntryId: number | null;
  onStopAtmosphere: () => void;
  input: string;
  inputRef: Ref<HTMLInputElement>;
  inputProps: {
    value: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  };
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClick: (event: MouseEvent<HTMLElement>) => void;
  /** Set on the scrolling element by the hook that owns the window's height. */
  bodyRef: Ref<HTMLDivElement>;
  bodyStyle: { height?: number; minHeight?: number; maxHeight?: number } | undefined;
  /** Floating, the frame owns the height and the body takes what is left. */
  fill: boolean;
}

/**
 * Everything under the terminal's title bar: what has been run so far, and
 * the line being typed. It scrolls, and a click anywhere in it hands the
 * caret to the prompt the way a real terminal takes focus.
 */
const TerminalBody = ({
  entries,
  atmosphereEntryId,
  onStopAtmosphere,
  input,
  inputRef,
  inputProps,
  onSubmit,
  onClick,
  bodyRef,
  bodyStyle,
  fill,
}: TerminalBodyProps) => {
  const { t } = useTranslation();

  return (
    // A click anywhere in the window hands focus to the input, which is the
    // keyboard-reachable control, so the div itself needs no key handling.
    <div
      ref={bodyRef}
      className={`flex cursor-text flex-col gap-2.5 overflow-y-auto overscroll-contain px-4 pb-4 pt-5 font-mono text-[15px] leading-[1.6] [scrollbar-color:var(--color-gray-500)_transparent] [scrollbar-width:thin] sm:px-6 ${
        fill ? "min-h-0 flex-1" : ""
      }`}
      style={bodyStyle}
      onClick={onClick}
    >
      <div className="flex flex-col gap-2.5" aria-live="polite">
        {entries.map(({ id, command, result }) => (
          <TerminalEntry
            key={id}
            command={command}
            result={result}
            onStopAtmosphere={id === atmosphereEntryId ? onStopAtmosphere : undefined}
          />
        ))}
      </div>

      <form onSubmit={onSubmit} className="flex min-h-11 items-center gap-2.5">
        <Prompt />
        <label className="sr-only" htmlFor="terminal-input">
          {t("terminal.inputLabel")}
        </label>
        {/* The block cursor is the only caret: the input's own is hidden and
            the input is sized to its text in `ch`, exact in a mono font, so
            the block always sits right after the last typed character. */}
        <span className="flex min-w-0 flex-1 items-center">
          {/* `font-mono` on the input itself: the global font rule reaches
              inputs directly, so it would not inherit it from the window.
              16px on phones: below that iOS zooms the page in on focus. */}
          <input
            ref={inputRef}
            id="terminal-input"
            type="text"
            size={1}
            className="min-w-0 max-w-full shrink bg-transparent font-mono text-base text-white caret-transparent outline-hidden sm:text-[15px]"
            style={{ width: `${input.length}ch` }}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="enter"
            {...inputProps}
          />
          <span
            className="h-[18px] w-[9px] shrink-0 bg-white animate-blink motion-reduce:animate-none"
            aria-hidden="true"
          />
        </span>
      </form>
    </div>
  );
};

export default TerminalBody;
