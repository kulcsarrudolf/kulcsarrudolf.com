import {
  type KeyboardEvent,
  type PointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

/** How small the window may be dragged, unless the viewport is smaller still. */
export const MIN_WIDTH = 320;
export const MIN_FLOATING_HEIGHT = 200;
/** How close to the viewport's edges a floating window may be put. */
const MARGIN = 8;
/** How far one arrow key moves an edge. */
const KEY_STEP = 24;

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Which edges a grab moves. No direction is the title bar, which moves all four. */
export type Direction = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

/** What a grabbable strip spreads onto itself: one pointer gesture, captured. */
export interface GrabProps {
  onPointerDown: (event: PointerEvent<HTMLElement>) => void;
  onPointerMove: (event: PointerEvent<HTMLElement>) => void;
  onPointerUp: (event: PointerEvent<HTMLElement>) => void;
  onPointerCancel: (event: PointerEvent<HTMLElement>) => void;
}

interface Bounds {
  width: number;
  height: number;
  minWidth: number;
  minHeight: number;
}

const viewport = (): Bounds => ({
  width: window.innerWidth,
  height: window.innerHeight,
  minWidth: Math.min(MIN_WIDTH, window.innerWidth - MARGIN * 2),
  minHeight: Math.min(MIN_FLOATING_HEIGHT, window.innerHeight - MARGIN * 2),
});

const clamp = (value: number, low: number, high: number) =>
  Math.round(Math.min(Math.max(value, low), Math.max(low, high)));

/** Keeps the whole window on screen, so it can never be dragged out of reach. */
const place = (rect: Rect, bounds: Bounds): Rect => {
  const width = clamp(rect.width, bounds.minWidth, bounds.width - MARGIN * 2);
  const height = clamp(rect.height, bounds.minHeight, bounds.height - MARGIN * 2);
  return {
    width,
    height,
    x: clamp(rect.x, MARGIN, bounds.width - width - MARGIN),
    y: clamp(rect.y, MARGIN, bounds.height - height - MARGIN),
  };
};

/**
 * Where a grab on one edge leaves the window. The edges being dragged move;
 * the opposite ones stay put, so the minimum size is reached by the window
 * stopping rather than by it sliding away under the pointer, and a window
 * grown to the left or upwards stops at the edge of the screen.
 */
const resize = (
  start: Rect,
  direction: Direction,
  dx: number,
  dy: number,
  bounds: Bounds,
): Rect => {
  const rect = { ...start };

  if (direction.includes("e")) {
    rect.width = clamp(start.width + dx, bounds.minWidth, bounds.width - start.x - MARGIN);
  }
  if (direction.includes("w")) {
    const right = start.x + start.width;
    rect.width = clamp(start.width - dx, bounds.minWidth, right - MARGIN);
    rect.x = right - rect.width;
  }
  if (direction.includes("s")) {
    rect.height = clamp(start.height + dy, bounds.minHeight, bounds.height - start.y - MARGIN);
  }
  if (direction.includes("n")) {
    const bottom = start.y + start.height;
    rect.height = clamp(start.height - dy, bounds.minHeight, bottom - MARGIN);
    rect.y = bottom - rect.height;
  }

  return rect;
};

/**
 * A window floating over the page: where it sits, and the pointer handlers
 * that move and resize it.
 *
 * `lift` takes the rectangle the terminal occupies on the page and floats it
 * from exactly there, so pressing the green button looks like the window
 * coming off the page rather than jumping somewhere else. The title bar drags
 * it; the strips around its edges resize it, each from the edge it is on,
 * down to a floor on both axes. Nothing may leave the viewport, and a window
 * left near an edge is pulled back in when the viewport shrinks under it.
 */
export function useFloatingFrame() {
  const [rect, setRect] = useState<Rect | null>(null);
  const grabRef = useRef<{
    startX: number;
    startY: number;
    start: Rect;
    direction?: Direction;
  } | null>(null);

  const lift = useCallback((from: DOMRect) => {
    setRect(place({ x: from.x, y: from.y, width: from.width, height: from.height }, viewport()));
  }, []);

  const drop = useCallback(() => setRect(null), []);

  useEffect(() => {
    if (!rect) return;
    const onResize = () => setRect((current) => (current ? place(current, viewport()) : current));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [rect]);

  const onPointerDown = useCallback(
    (direction?: Direction) => (event: PointerEvent<HTMLElement>) => {
      if (!rect || event.button !== 0) return;
      // The three buttons sit in the bar the window is dragged by. A press on
      // one of them is that button's: taking it as a drag would also swallow
      // the click, since the `preventDefault` below is what stops a pointer
      // gesture turning into mouse events.
      if ((event.target as HTMLElement).closest("button")) return;
      // Without this the drag selects the text it passes over instead.
      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);
      grabRef.current = { startX: event.clientX, startY: event.clientY, start: rect, direction };
    },
    [rect],
  );

  const onPointerMove = useCallback((event: PointerEvent<HTMLElement>) => {
    const grab = grabRef.current;
    if (!grab) return;

    const dx = event.clientX - grab.startX;
    const dy = event.clientY - grab.startY;
    const bounds = viewport();

    setRect(
      grab.direction
        ? resize(grab.start, grab.direction, dx, dy, bounds)
        : place({ ...grab.start, x: grab.start.x + dx, y: grab.start.y + dy }, bounds),
    );
  }, []);

  const onPointerUp = useCallback((event: PointerEvent<HTMLElement>) => {
    grabRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }, []);

  // The strip along the bottom of the window is the one focusable edge, so
  // while the window floats it works both axes: up and down for the height,
  // left and right for the width, Home and End for the floor and the ceiling.
  const onKeyDown = useCallback((event: KeyboardEvent<HTMLElement>) => {
    const bounds = viewport();
    const steps: Record<string, { dx?: number; dy?: number }> = {
      ArrowUp: { dy: -KEY_STEP },
      ArrowDown: { dy: KEY_STEP },
      ArrowLeft: { dx: -KEY_STEP },
      ArrowRight: { dx: KEY_STEP },
      Home: { dx: -bounds.width, dy: -bounds.height },
      End: { dx: bounds.width, dy: bounds.height },
    };
    const step = steps[event.key];
    if (!step) return;

    event.preventDefault();
    setRect((current) =>
      current ? resize(current, "se", step.dx ?? 0, step.dy ?? 0, bounds) : current,
    );
  }, []);

  const grabProps = useCallback(
    (direction?: Direction): GrabProps => ({
      onPointerDown: onPointerDown(direction),
      onPointerMove,
      onPointerUp,
      onPointerCancel: onPointerUp,
    }),
    [onPointerDown, onPointerMove, onPointerUp],
  );

  return {
    rect,
    lift,
    drop,
    grabProps,
    /** What the window's bottom strip becomes once the window floats. */
    handleProps: { ...grabProps("s"), onKeyDown },
  };
}
