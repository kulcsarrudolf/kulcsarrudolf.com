import {
  type KeyboardEvent,
  type PointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

/** The floor: `clear` leaves a window, not a strip with one prompt in it. */
export const MIN_HEIGHT = 160;
/** How far the window grows on its own before the history scrolls instead. */
export const MAX_AUTO_HEIGHT = 360;
/** How far the visitor can drag it. */
export const MAX_HEIGHT = 720;

const KEY_STEP = 24;

const clamp = (height: number) => Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, Math.round(height)));

/**
 * The height of the terminal's body, the way a real terminal window has one.
 *
 * Left alone it sizes to its content between a floor and a ceiling, and past
 * the ceiling the history scrolls. Dragging the handle under it (or the arrow
 * keys on it, Home and End for the limits) sets a fixed height instead;
 * a double-click hands it back to the content.
 *
 * `fill` is for the window that has come off the page: there the frame owns
 * the height and the body takes what is left under the title bar, so the body
 * holds no height of its own until the window is set back down, which still
 * has the one it was dragged to.
 */
export function useTerminalHeight(fill: boolean) {
  const dragRef = useRef<{ startY: number; startHeight: number } | null>(null);

  // The body is held in state rather than a ref alone: closing the window and
  // floating it both build it again, and the observer has to follow it there.
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const [body, setBody] = useState<HTMLDivElement | null>(null);
  const attachBody = useCallback((node: HTMLDivElement | null) => {
    bodyRef.current = node;
    setBody(node);
  }, []);

  // `null` is the content-sized state.
  const [height, setHeight] = useState<number | null>(null);
  // What the body actually measures, for the handle to report as its value.
  const [measured, setMeasured] = useState(MIN_HEIGHT);

  useEffect(() => {
    if (!body) return;

    const observer = new ResizeObserver(() => setMeasured(Math.round(body.offsetHeight)));
    observer.observe(body);
    return () => observer.disconnect();
  }, [body]);

  const onPointerDown = useCallback((event: PointerEvent<HTMLElement>) => {
    // Stops the drag selecting text on the page underneath.
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      startY: event.clientY,
      startHeight: bodyRef.current?.offsetHeight ?? MIN_HEIGHT,
    };
  }, []);

  const onPointerMove = useCallback((event: PointerEvent<HTMLElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    setHeight(clamp(drag.startHeight + event.clientY - drag.startY));
  }, []);

  const onPointerUp = useCallback((event: PointerEvent<HTMLElement>) => {
    dragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }, []);

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      const steps: Record<string, number> = {
        ArrowUp: measured - KEY_STEP,
        ArrowDown: measured + KEY_STEP,
        Home: MIN_HEIGHT,
        End: MAX_HEIGHT,
      };
      const next = steps[event.key];
      if (next === undefined) return;
      event.preventDefault();
      setHeight(clamp(next));
    },
    [measured],
  );

  const reset = useCallback(() => setHeight(null), []);

  /**
   * Puts the bottom of the history in view. Once it is taller than the window
   * a new line lands out of sight, and a terminal follows its output down.
   */
  const scrollToLatest = useCallback(() => {
    const node = bodyRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, []);

  const contentSized = { minHeight: MIN_HEIGHT, maxHeight: MAX_AUTO_HEIGHT };

  return {
    attachBody,
    body,
    scrollToLatest,
    measured,
    bodyStyle: fill
      ? undefined
      : height === null
        ? contentSized
        : { height, minHeight: MIN_HEIGHT },
    handleProps: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel: onPointerUp,
      onKeyDown,
      onDoubleClick: reset,
    },
  };
}
