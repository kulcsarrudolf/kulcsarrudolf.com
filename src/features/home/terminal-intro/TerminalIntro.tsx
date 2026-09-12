import { useTranslation } from "@/i18n/useTranslation";

import Prompt from "./Prompt";
import TerminalEntry from "./TerminalEntry";
import { useTerminal } from "./useTerminal";

/**
 * The block that opens the home page: a terminal window in which `./intro.sh`
 * has just printed who I am and where to go next, with a prompt underneath
 * that actually takes commands. Return runs the line; `help` lists what
 * works, and a page name opens that page.
 *
 * Sits between the navbar and About Me. It is the one dark object on the page,
 * a counterweight to the brand-blue Let's Talk band further down, and it says
 * "developer" before a single paragraph is read. Everything in it is text, so
 * the copy lives in the translation files with the rest of the page.
 */
const TerminalIntro = () => {
  const { t } = useTranslation();
  const { entries, input, isFocused, inputRef, focusPrompt, onSubmit, inputProps } = useTerminal();

  // The block cursor blinks while the prompt is idle. Once it has focus the
  // input's own caret takes over, so the two never show at once.
  const showBlockCursor = !isFocused && input === "";

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

      {/* A click anywhere in the window hands focus to the input, which is
          the keyboard-reachable control, so the div itself needs no key
          handling. */}
      <div
        className="flex cursor-text flex-col gap-2.5 px-4 pb-4 pt-5 font-mono text-[15px] leading-[1.6] sm:px-6"
        onClick={focusPrompt}
      >
        <div className="flex flex-col gap-2.5" aria-live="polite">
          {entries.map(({ id, command, result }) => (
            <TerminalEntry key={id} command={command} result={result} />
          ))}
        </div>

        <form onSubmit={onSubmit} className="flex min-h-11 items-center gap-2.5">
          <Prompt />
          <label className="sr-only" htmlFor="terminal-intro-input">
            {t("home.terminalIntro.inputLabel")}
          </label>
          <span className="relative flex min-w-0 flex-1 items-center">
            {showBlockCursor && (
              <span
                className="pointer-events-none absolute left-0 h-[18px] w-[9px] bg-white animate-blink motion-reduce:animate-none"
                aria-hidden="true"
              />
            )}
            {/* 16px on phones: below that iOS zooms the page in on focus. */}
            <input
              ref={inputRef}
              id="terminal-intro-input"
              type="text"
              className="w-full min-w-0 bg-transparent text-base text-white caret-white outline-hidden sm:text-[15px]"
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              enterKeyHint="enter"
              {...inputProps}
            />
          </span>
        </form>
      </div>
    </section>
  );
};

export default TerminalIntro;
