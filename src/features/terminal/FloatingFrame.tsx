import type { ReactNode } from "react";

import ResizeEdges from "./ResizeEdges";
import type { Direction, GrabProps, Rect } from "./useFloatingFrame";

interface FloatingFrameProps {
  rect: Rect;
  /** Rolled up: the frame takes the height of its title bar and stops resizing. */
  shaded: boolean;
  grabProps: (direction: Direction) => GrabProps;
  children: ReactNode;
}

/**
 * The window once it has come off the page: fixed over everything, at the
 * position and size the floating frame holds, with the grab strips around its
 * edges. The deeper shadow is the one thing that changes about how it looks,
 * and it is what says the window is no longer lying on the page.
 *
 * It sits above the navbar, which is what "over the page" has to mean, and
 * below the dialogs, so the sudoku it can open still lands on top of it.
 *
 * Rolled up, the frame drops its height and lets the title bar decide it,
 * since resizing a window with nothing in it has nothing to resize.
 */
const FloatingFrame = ({ rect, shaded, grabProps, children }: FloatingFrameProps) => (
  <div
    className="fixed z-40 flex flex-col rounded-xl shadow-2xl shadow-black/40"
    style={{
      left: rect.x,
      top: rect.y,
      width: rect.width,
      height: shaded ? undefined : rect.height,
    }}
  >
    {children}
    {!shaded && <ResizeEdges grabProps={grabProps} />}
  </div>
);

export default FloatingFrame;
