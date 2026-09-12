import { useCallback, useEffect } from "react";
import { createPortal } from "react-dom";

import SudokuModal from "@/features/sudoku/SudokuModal";
import LovingAtmosphere from "@/features/wedding/LovingAtmosphere";
import { useTranslation } from "@/i18n/useTranslation";

import FloatingFrame from "./FloatingFrame";
import ResizeHandle from "./ResizeHandle";
import TerminalBody from "./TerminalBody";
import TerminalDock from "./TerminalDock";
import TitleBar from "./TitleBar";
import { useTerminal } from "./useTerminal";
import { MIN_FLOATING_HEIGHT } from "./useFloatingFrame";
import { MAX_HEIGHT, MIN_HEIGHT, useTerminalHeight } from "./useTerminalHeight";
import { useTerminalWindow } from "./useTerminalWindow";

const PATH = "~/kulcsarrudolf.com";

interface TerminalProps {
  /**
   * The terminal every page but the home page carries: closed until the
   * button in the corner is pressed, and never part of the page's flow.
   */
  launcher?: boolean;
}

/**
 * A terminal window in which `./intro.sh` has just printed who I am and where
 * to go next, with a prompt underneath that actually takes commands. Return
 * runs the line; `help` lists what works, and a page name opens that page.
 * Two commands are missing from that list on purpose: one counts down to the
 * wedding, the other opens the sudoku, and both are there to be found rather
 * than advertised; the wedding one also floats hearts over the whole page for
 * half a minute. The body has a floor, so `clear` leaves a window rather than
 * a strip, and a ceiling past which the history scrolls; the strip along the
 * bottom drags it taller or shorter.
 *
 * The three dots in its title bar are the window's, and they work: red closes
 * it to the button in the page's corner, amber rolls it up to the bar and back
 * down, and green either lifts it off the page or fills the screen with it,
 * depending on whether it has a page to be lifted off. Either way it becomes a
 * window that drags by its title bar and resizes from any edge, and the
 * session underneath is the same one, so nothing typed is lost by moving it.
 *
 * On the home page it opens the page, between the navbar and About Me: the one
 * dark object there, a counterweight to the brand-blue Let's Talk band further
 * down, saying "developer" before a single paragraph is read. Everywhere else
 * it is the `launcher`, waiting behind the button in the corner. Everything in
 * it is text, so the copy lives in the translation files with the pages.
 */
const Terminal = ({ launcher = false }: TerminalProps) => {
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
  } = useTerminal(!launcher);

  // The page must not scroll to the prompt when the window is opened or put
  // back: what moved is the window, and the visitor is looking at it.
  const focusInput = useCallback(
    () => inputRef.current?.focus({ preventScroll: true }),
    [inputRef],
  );

  const {
    dockRef,
    closed,
    shaded,
    rect,
    zoomed,
    grabProps,
    floatingHandleProps,
    close,
    open,
    toggleShade,
    toggleZoom,
  } = useTerminalWindow(launcher, focusInput);

  const floating = rect !== null;
  const { attachBody, body, scrollToLatest, measured, bodyStyle, handleProps } =
    useTerminalHeight(floating);

  // A new line, and the body the window was rebuilt with when it floated or
  // came back, both want the history scrolled to its end.
  useEffect(scrollToLatest, [scrollToLatest, body, entries]);

  const terminalWindow = (
    <section
      aria-label={t("terminal.label") as string}
      className={`flex flex-col overflow-hidden rounded-xl bg-gray-800 ${
        floating ? "h-full" : "shadow-md"
      }`}
    >
      <TitleBar
        path={PATH}
        shaded={shaded}
        pressed={launcher ? zoomed : floating}
        onClose={close}
        onShade={toggleShade}
        onZoom={toggleZoom}
        dragProps={floating ? grabProps() : undefined}
        dragLabel={t("terminal.move") as string}
        labels={{
          close: t("terminal.close") as string,
          shade: t("terminal.shade") as string,
          unshade: t("terminal.unshade") as string,
          // Green means "put it back where it came from" only when it came
          // from somewhere. The launcher's fills the screen instead.
          float: t(launcher ? "terminal.zoom" : "terminal.float") as string,
          dock: t(launcher ? "terminal.unzoom" : "terminal.dock") as string,
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
          <TerminalBody
            entries={entries}
            atmosphereEntryId={atmosphereEntryId}
            onStopAtmosphere={atmosphere.stop}
            input={input}
            inputRef={inputRef}
            inputProps={inputProps}
            onSubmit={onSubmit}
            onClick={focusPrompt}
            bodyRef={attachBody}
            bodyStyle={bodyStyle}
            fill={floating}
          />

          {/* Docked, the strip is the whole of the resizing and only moves the
              height. Floating, the frame's edges do the pointer work and the
              strip stays as the way to it without a mouse, on both axes. */}
          <ResizeHandle
            label={t(floating ? "terminal.resizeWindow" : "terminal.resize") as string}
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
        <TerminalDock onOpen={open} label={t("terminal.open") as string} />
      ) : (
        <>
          {/* The dock is where the window lies on the page, and what the green
              button measures to lift it from exactly there. It takes no room
              once the window is off the page, so nothing is left standing open
              between the navbar and About Me. The launcher has no such place
              on the page, and renders nothing here at all. */}
          {!launcher && <div ref={dockRef}>{!floating && terminalWindow}</div>}

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

export default Terminal;
