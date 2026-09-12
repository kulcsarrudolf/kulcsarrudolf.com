import { useEffect } from "react";

import { useTranslation } from "@/i18n/useTranslation";

import Prompt from "./Prompt";
import ResizeHandle from "./ResizeHandle";
import TerminalEntry from "./TerminalEntry";
import { useTerminal } from "./useTerminal";
import { MAX_HEIGHT, MIN_HEIGHT, useTerminalHeight } from "./useTerminalHeight";

/**
 * The block that opens the home page: a terminal window in which `./intro.sh`
 * has just printed who I am and where to go next, with a prompt underneath
 * that actually takes commands. Return runs the line; `help` lists what
 * works, and a page name opens that page. The body has a floor, so `clear`
 * leaves a window rather than a strip, and a ceiling past which the history
 * scrolls; the strip along the bottom drags it taller or shorter.
 *
 * Sits between the navbar and About Me. It is the one dark object on the page,
 * a counterweight to the brand-blue Let's Talk band further down, and it says
 * "developer" before a single paragraph is read. Everything in it is text, so
 * the copy lives in the translation files with the rest of the page.
 */
const TerminalIntro = () => {
  const { t } = useTranslation();
  const { entries, input, inputRef, focusPrompt, onSubmit, inputProps } = useTerminal();
  const { bodyRef, measured, bodyStyle, handleProps } = useTerminalHeight();

  // Once the history is taller than the window, a new line lands out of
  // sight, so the body follows it down the way a terminal does.
  useEffect(() => {
    const body = bodyRef.current;
    if (body) body.scrollTop = body.scrollHeight;
  }, [bodyRef, entries]);

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
        ref={bodyRef}
        className="flex cursor-text flex-col gap-2.5 overflow-y-auto overscroll-contain px-4 pb-4 pt-5 font-mono text-[15px] leading-[1.6] [scrollbar-color:var(--color-gray-500)_transparent] [scrollbar-width:thin] sm:px-6"
        style={bodyStyle}
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
          {/* The block cursor is the only caret: the input's own is hidden and
              the input is sized to its text in `ch`, exact in a mono font, so
              the block always sits right after the last typed character. */}
          <span className="flex min-w-0 flex-1 items-center">
            {/* `font-mono` on the input itself: the global font rule reaches
                inputs directly, so it would not inherit it from the window.
                16px on phones: below that iOS zooms the page in on focus. */}
            <input
              ref={inputRef}
              id="terminal-intro-input"
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

      <ResizeHandle
        label={t("home.terminalIntro.resize") as string}
        value={measured}
        min={MIN_HEIGHT}
        max={MAX_HEIGHT}
        {...handleProps}
      />
    </section>
  );
};

export default TerminalIntro;
