import { useCallback, useEffect } from "react";
import { createPortal } from "react-dom";

import SudokuModal from "@/features/sudoku/SudokuModal";
import LovingAtmosphere from "@/features/wedding/LovingAtmosphere";
import { useTranslation } from "@/i18n/useTranslation";

import FloatingFrame from "./FloatingFrame";
import Prompt from "./Prompt";
import ResizeHandle from "./ResizeHandle";
import TerminalDock from "./TerminalDock";
import TerminalEntry from "./TerminalEntry";
import TitleBar from "./TitleBar";
import { useTerminal } from "./useTerminal";
import { MIN_FLOATING_HEIGHT } from "./useFloatingFrame";
import { MAX_HEIGHT, MIN_HEIGHT, useTerminalHeight } from "./useTerminalHeight";
import { useTerminalWindow } from "./useTerminalWindow";

const PATH = "~/kulcsarrudolf.com";

/**
 * The block that opens the home page: a terminal window in which `./intro.sh`
 * has just printed who I am and where to go next, with a prompt underneath
 * that actually takes commands. Return runs the line; `help` lists what
 * works, and a page name opens that page. Two commands are missing from that
 * list on purpose: one counts down to the wedding, the other opens the
 * sudoku, and both are there to be found rather than advertised; the wedding
 * one also floats hearts over the whole page for half a minute. The body has a
 * floor, so `clear` leaves a window rather than a strip, and a ceiling past
 * which the history scrolls; the strip along the bottom drags it taller or
 * shorter. Where there is a mouse, the caret is already at the prompt on
 * arrival, so typing works without clicking into it first.
 *
 * The three dots in its title bar are the window's, and they work: red closes
 * it to the button in the page's corner, amber rolls it up to the bar and back
 * down, and green lifts it off the page into a window that drags by its title
 * bar and resizes from any edge. Whichever of those it is in, the session
 * underneath is the same one, so nothing typed is lost by moving the window.
 *
 * Sits between the navbar and About Me. It is the one dark object on the page,
 * a counterweight to the brand-blue Let's Talk band further down, and it says
 * "developer" before a single paragraph is read. Everything in it is text, so
 * the copy lives in the translation files with the rest of the page.
 */
const TerminalIntro = () => {
  const { t } = useTranslation();
  const {
    entries,
    input,
    inputRef,
    atmosphere,
    atmosphereEntryId,
    sudokuOpen,
    closeSudoku,
    focusPrompt,
    onSubmit,
    inputProps,
  } = useTerminal();

  // The page must not scroll to the prompt when the window is put back or
  // brought back: what moved is the window, and the visitor is looking at it.
  const focusInput = useCallback(
    () => inputRef.current?.focus({ preventScroll: true }),
    [inputRef],
  );

  const {
    dockRef,
    closed,
    shaded,
    rect,
    grabProps,
    floatingHandleProps,
    dockedHeight,
    close,
    open,
    toggleShade,
    toggleFloat,
  } = useTerminalWindow(focusInput);

  const floating = rect !== null;
  const { attachBody, body, scrollToLatest, measured, bodyStyle, handleProps } =
    useTerminalHeight(floating);

  // A new line, and the body the window was rebuilt with when it floated or
  // came back, both want the history scrolled to its end.
  useEffect(scrollToLatest, [scrollToLatest, body, entries]);

  const terminalWindow = (
    <section
      aria-label={t("home.terminalIntro.label") as string}
      className={`flex flex-col overflow-hidden rounded-xl bg-gray-800 ${
        floating ? "h-full" : "shadow-md"
      }`}
    >
      <TitleBar
        path={PATH}
        shaded={shaded}
        floating={floating}
        onClose={close}
        onShade={toggleShade}
        onZoom={toggleFloat}
        dragProps={floating ? grabProps() : undefined}
        dragLabel={t("home.terminalIntro.move") as string}
        labels={{
          close: t("home.terminalIntro.close") as string,
          shade: t("home.terminalIntro.shade") as string,
          unshade: t("home.terminalIntro.unshade") as string,
          float: t("home.terminalIntro.float") as string,
          dock: t("home.terminalIntro.dock") as string,
        }}
      />

      {/* Rolling up is a row going from its content's height to none of it,
          which is a size the browser can animate; unmounting the body would
          take the scrollback and the half-typed line with it. */}
      <div
        className={`grid min-h-0 transition-[grid-template-rows] duration-200 motion-reduce:transition-none ${
          floating && !shaded ? "flex-1" : ""
        }`}
        style={{ gridTemplateRows: shaded ? "0fr" : "1fr" }}
      >
        <div className="flex min-h-0 flex-col overflow-hidden" inert={shaded || undefined}>
          {/* A click anywhere in the window hands focus to the input, which is
              the keyboard-reachable control, so the div itself needs no key
              handling. */}
          <div
            ref={attachBody}
            className={`flex cursor-text flex-col gap-2.5 overflow-y-auto overscroll-contain px-4 pb-4 pt-5 font-mono text-[15px] leading-[1.6] [scrollbar-color:var(--color-gray-500)_transparent] [scrollbar-width:thin] sm:px-6 ${
              floating ? "min-h-0 flex-1" : ""
            }`}
            style={bodyStyle}
            onClick={focusPrompt}
          >
            <div className="flex flex-col gap-2.5" aria-live="polite">
              {entries.map(({ id, command, result }) => (
                <TerminalEntry
                  key={id}
                  command={command}
                  result={result}
                  onStopAtmosphere={id === atmosphereEntryId ? atmosphere.stop : undefined}
                />
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

          {/* Docked, the strip is the whole of the resizing and only moves the
              height. Floating, the frame's edges do the pointer work and the
              strip stays as the way to it without a mouse, on both axes. */}
          <ResizeHandle
            label={
              t(
                floating ? "home.terminalIntro.resizeWindow" : "home.terminalIntro.resize",
              ) as string
            }
            value={rect ? rect.height : measured}
            min={rect ? MIN_FLOATING_HEIGHT : MIN_HEIGHT}
            max={rect ? Math.max(MAX_HEIGHT, rect.height) : MAX_HEIGHT}
            {...(floating ? floatingHandleProps : handleProps)}
          />
        </div>
      </div>
    </section>
  );

  return (
    <>
      {closed ? (
        // Closing keeps where the window was and how big it had been grown,
        // so the button in the corner opens onto the session as it was left.
        <TerminalDock onOpen={open} label={t("home.terminalIntro.open") as string} />
      ) : (
        <>
          {/* The dock is where the window lies on the page, and what the green
              button measures to lift it from exactly there. While it is away
              the dock holds the height it had, so About Me does not ride up. */}
          <div ref={dockRef} style={dockedHeight === null ? undefined : { height: dockedHeight }}>
            {!floating && terminalWindow}
          </div>

          {rect &&
            createPortal(
              <FloatingFrame rect={rect} shaded={shaded} grabProps={grabProps}>
                {terminalWindow}
              </FloatingFrame>,
              document.body,
            )}
        </>
      )}

      {sudokuOpen && <SudokuModal onClose={closeSudoku} />}

      {atmosphere.running && (
        <LovingAtmosphere fading={atmosphere.fading} fadeMs={atmosphere.fadeMs} />
      )}
    </>
  );
};

export default TerminalIntro;
