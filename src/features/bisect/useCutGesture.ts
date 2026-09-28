import { type KeyboardEvent, type MouseEvent, type PointerEvent, useRef, useState } from "react";

import { CENTER, RIM_RADIUS } from "./board";
import { aimOf, chord, type Line, lineAt, type Point, snapped } from "./geometry";

/** What a line on the board was drawn with. */
export type AimSource = "pointer" | "keys";

/**
 * How far a press has to travel before it is a line, in CSS pixels, so it is
 * the same distance under the hand whatever size the board is drawn at. A
 * finger wanders more than a mouse does, and a line this short would swing
 * wildly anyway, so touch asks for the most.
 */
const MIN_DRAG: Record<string, number> = { mouse: 6, pen: 10, touch: 16 };
/** The angles a line drawn with Shift held snaps to, in degrees. */
const SNAP = 15;
/** How long the phone buzzes when a finger lets go of a cut, in milliseconds. */
const BUZZ = 10;
/** Degrees per arrow press, and with Shift held. */
const TURN = 2;
const TURN_FAST = 10;
/** Board units per arrow press, and with Shift held. */
const SLIDE = 1;
const SLIDE_FAST = 5;
/** Where the keyboard's line starts when there is none on the board yet. */
const KEYBOARD_START = { angle: 90, offset: 0 };

const SECONDARY_BUTTON = 2;

interface CutGestureOptions {
  /** The line being drawn, if any. */
  aim: Line | null;
  /** The line of the cut on the board, if any: the keyboard carries on from it. */
  lastLine: Line | null;
  onAim: (line: Line | null, by: AimSource) => void;
  onCut: (line: Line) => void;
}

/** The press a line is being drawn from. */
interface Drag {
  pointerId: number;
  /** Where it landed, in board units. */
  start: Point;
  /** Where it landed on the screen, and how far from there a line begins. */
  startX: number;
  startY: number;
  minDrag: number;
}

/**
 * How a line is drawn across the board. With a pointer, a press and a drag
 * draws it through both points and letting go cuts, the way Cutle plays. With
 * the keyboard, the arrows bring a line up and then turn it (left and right)
 * or slide it (up and down), and Enter or Space cuts along it.
 *
 * Only a shape's first cut counts, so a line can always be taken back before
 * it is let go of: by dragging back to where the press started, by putting a
 * second finger down, by pressing the other mouse button, or with Escape.
 */
export function useCutGesture({ aim, lastLine, onAim, onCut }: CutGestureOptions) {
  const svgRef = useRef<SVGSVGElement>(null);
  const dragRef = useRef<Drag | null>(null);
  // Where the press landed, for the board to mark while the drag lasts.
  const [press, setPress] = useState<Point | null>(null);

  // The pointer's position in the board's own units, whatever size it is drawn at.
  const toBoard = (event: PointerEvent<SVGSVGElement>): Point | null => {
    const matrix = svgRef.current?.getScreenCTM();
    if (!matrix) return null;
    const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse());
    return [point.x, point.y];
  };

  // The line from where the press started to the pointer, once it is long
  // enough to mean something and crosses the circle.
  const lineTo = (drag: Drag, event: PointerEvent<SVGSVGElement>): Line | null => {
    const travelled = Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY);
    if (travelled < drag.minDrag) return null;
    const end = toBoard(event);
    if (!end) return null;
    const drawn = { from: drag.start, to: end };
    const line = event.shiftKey ? snapped(drawn, SNAP) : drawn;
    return chord(line, CENTER, RIM_RADIUS) ? line : null;
  };

  /** The drag this event belongs to, if it belongs to one. */
  const dragOf = (event: PointerEvent<SVGSVGElement>) => {
    const drag = dragRef.current;
    return drag && drag.pointerId === event.pointerId ? drag : null;
  };

  const endDrag = () => {
    const drag = dragRef.current;
    if (!drag) return;
    dragRef.current = null;
    setPress(null);
    if (svgRef.current?.hasPointerCapture(drag.pointerId)) {
      svgRef.current.releasePointerCapture(drag.pointerId);
    }
  };

  const cancel = (by: AimSource) => {
    endDrag();
    if (aim) onAim(null, by);
  };

  const onPointerDown = (event: PointerEvent<SVGSVGElement>) => {
    // A second finger, or a second button, is the way out of a line.
    if (dragRef.current) {
      cancel("pointer");
      return;
    }
    if (!event.isPrimary || event.button !== 0) return;
    const start = toBoard(event);
    if (!start) return;

    // The board keeps the pointer, so the drag carries on past its edge.
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      start,
      startX: event.clientX,
      startY: event.clientY,
      minDrag: MIN_DRAG[event.pointerType] ?? MIN_DRAG.touch,
    };
    setPress(start);
  };

  const onPointerMove = (event: PointerEvent<SVGSVGElement>) => {
    const drag = dragOf(event);
    if (!drag) return;
    // A button pressed mid-drag arrives as a move, not as a press.
    if (event.buttons & SECONDARY_BUTTON) {
      cancel("pointer");
      return;
    }
    const line = lineTo(drag, event);
    if (line) onAim(line, "pointer");
    else if (aim) onAim(null, "pointer");
  };

  const onPointerUp = (event: PointerEvent<SVGSVGElement>) => {
    const drag = dragOf(event);
    if (!drag) return;
    const line = lineTo(drag, event);
    endDrag();
    if (!line) {
      if (aim) onAim(null, "pointer");
      return;
    }
    onCut(line);
    if (event.pointerType === "touch" && "vibrate" in navigator) navigator.vibrate(BUZZ);
  };

  // The browser took the pointer away: a call, a system gesture, a scroll.
  const onPointerCancel = (event: PointerEvent<SVGSVGElement>) => {
    if (dragOf(event)) cancel("pointer");
  };

  // A long press or a right click is not asking for a menu here.
  const onContextMenu = (event: MouseEvent<SVGSVGElement>) => event.preventDefault();

  const onKeyDown = (event: KeyboardEvent<SVGSVGElement>) => {
    if (event.key === "Escape") {
      if (!dragRef.current && !aim) return;
      // The line is what Escape takes back, not the window around the board.
      event.preventDefault();
      event.stopPropagation();
      cancel(dragRef.current ? "pointer" : "keys");
      return;
    }

    // The keyboard stays out of a line the pointer is drawing.
    if (dragRef.current) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (aim) onCut(aim);
      return;
    }

    const turn = event.shiftKey ? TURN_FAST : TURN;
    const slide = event.shiftKey ? SLIDE_FAST : SLIDE;
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [-turn, 0],
      ArrowRight: [turn, 0],
      ArrowUp: [0, slide],
      ArrowDown: [0, -slide],
    };
    const move = moves[event.key];
    if (!move) return;
    event.preventDefault();

    const current = aim ?? lastLine;
    // The first press brings a line up where it can be seen, and moves it
    // only from the second on.
    if (!current) {
      onAim(lineAt(CENTER, KEYBOARD_START.angle, KEYBOARD_START.offset), "keys");
      return;
    }
    const { angle, offset } = aimOf(CENTER, current);
    const reach = RIM_RADIUS - 1;
    const moved = Math.min(reach, Math.max(-reach, offset + move[1]));
    onAim(lineAt(CENTER, angle + move[0], moved), "keys");
  };

  return {
    svgRef,
    press,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel,
      onLostPointerCapture: onPointerCancel,
      onContextMenu,
      onKeyDown,
    },
  };
}
