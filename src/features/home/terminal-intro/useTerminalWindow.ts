import { type RefObject, useCallback, useRef, useState } from "react";

import { useFloatingFrame } from "./useFloatingFrame";

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
 * The green button lifts the window from exactly the rectangle it occupies on
 * the page, which is why the dock element it sits in is measured rather than
 * guessed. What it leaves behind closes up: a window lifted over the page has
 * left the page, and holding its old height open would leave a hole in it.
 */
export function useTerminalWindow(onRestoreFocus: () => void) {
  const dockRef = useRef<HTMLDivElement>(null);

  const [closed, setClosed] = useState(false);
  const [shaded, setShaded] = useState(false);

  const frame = useFloatingFrame();
  const { rect, lift, drop } = frame;

  const close = useCallback(() => setClosed(true), []);

  const open = useCallback(() => {
    setClosed(false);
    restoreCaret(onRestoreFocus);
  }, [onRestoreFocus]);

  const toggleShade = useCallback(() => setShaded((rolled) => !rolled), []);

  const toggleFloat = useCallback(() => {
    const dock = dockRef.current;
    if (!dock) return;

    if (rect) drop();
    else lift(dock.getBoundingClientRect());

    restoreCaret(onRestoreFocus);
  }, [drop, lift, onRestoreFocus, rect]);

  return {
    dockRef: dockRef as RefObject<HTMLDivElement | null>,
    closed,
    shaded,
    rect,
    grabProps: frame.grabProps,
    /** What the window's bottom strip does while it floats: both axes. */
    floatingHandleProps: frame.handleProps,
    close,
    open,
    toggleShade,
    toggleFloat,
  };
}
