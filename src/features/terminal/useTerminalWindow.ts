import { useRouterState } from "@tanstack/react-router";
import { type RefObject, useCallback, useEffect, useRef, useState } from "react";

import { openingRect, useFloatingFrame } from "./useFloatingFrame";

/**
 * Opening the window and moving it between the page and the portal both build
 * its markup again, so the caret that was at the prompt is put back once the
 * input it belongs to exists.
 */
const restoreCaret = (focus: () => void) => requestAnimationFrame(focus);

/**
 * What the three buttons in the title bar do, and where the window is as a
 * result of them.
 *
 * Closed, the window is gone from the page and the button in the corner is
 * the way back; the terminal's own history is not held here, so what comes
 * back is the session that was closed rather than a fresh one. Shaded, it is
 * rolled up to its title bar and still in place. Floating, it has come off
 * the page and is over it, at the size and position the frame keeps.
 *
 * A terminal that belongs to the page it is on starts open, in the flow, and
 * green lifts it off the page from exactly the rectangle it occupies there —
 * which is why the dock element it sits in is measured rather than guessed.
 * What it leaves behind closes up: a window lifted over the page has left the
 * page, and holding its old height open would leave a hole in it.
 *
 * A launcher terminal is the one every other page carries. It starts closed,
 * opens into the corner its button was pressed in, and is never in the flow
 * of a page it does not belong to, so its green button does the other thing a
 * green button does: fill the screen, and give the size back on the second
 * press. It closes itself when the visitor changes page, since a window over
 * a page the visitor has left is a window in the way.
 */
export function useTerminalWindow(launcher: boolean, onRestoreFocus: () => void) {
  const dockRef = useRef<HTMLDivElement>(null);
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  const [closed, setClosed] = useState(launcher);
  const [shaded, setShaded] = useState(false);

  const frame = useFloatingFrame();
  const { rect, lift, drop, zoom } = frame;

  const close = useCallback(() => setClosed(true), []);

  // Typing a page name at the prompt is the shortest way out of the window,
  // so the page it opens is not the page it opens behind.
  useEffect(() => {
    if (launcher) setClosed(true);
  }, [launcher, pathname]);

  const open = useCallback(() => {
    setClosed(false);
    setShaded(false);
    // A launcher window has no place on the page to sit, so it comes up over
    // the corner its button was in, at the size it was left at if it has one.
    if (launcher && !rect) lift(openingRect());
    restoreCaret(onRestoreFocus);
  }, [launcher, lift, onRestoreFocus, rect]);

  const toggleShade = useCallback(() => setShaded((rolled) => !rolled), []);

  const toggleZoom = useCallback(() => {
    if (launcher) {
      zoom();
      return;
    }

    const dock = dockRef.current;
    if (!dock) return;

    if (rect) drop();
    else lift(dock.getBoundingClientRect());

    restoreCaret(onRestoreFocus);
  }, [drop, launcher, lift, onRestoreFocus, rect, zoom]);

  return {
    dockRef: dockRef as RefObject<HTMLDivElement | null>,
    closed,
    shaded,
    rect,
    zoomed: frame.zoomed,
    grabProps: frame.grabProps,
    /** What the window's bottom strip does while it floats: both axes. */
    floatingHandleProps: frame.handleProps,
    close,
    open,
    toggleShade,
    toggleZoom,
  };
}
