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
/**
 * How close to an end of the line a press has to land to take hold of it, in
 * CSS pixels. A fingertip is wide and covers what it presses, so touch gets
 * the widest reach.
 */
const GRAB: Record<string, number> = { mouse: 12, pen: 16, touch: 28 };
/** How close the two ends may come on the rim, in board units, so the line never vanishes. */
const MIN_CHORD = 6;
/** The angles a line drawn with Shift held snaps to, in degrees. */
const SNAP = 15;
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

/** Which end of the line a press took hold of: 0 for where it enters the rim, 1 for where it leaves. */
export type Handle = 0 | 1;

/** The press a line is being drawn or adjusted from. */
interface Drag {
  pointerId: number;
  /** Where it landed, in board units. */
  start: Point;
  /** Where it landed on the screen, and how far from there a line begins. */
  startX: number;
  startY: number;
  minDrag: number;
  /** The line on the board when the press landed, to put back if it is taken back. */
  before: Line | null;
  /** The end being moved, with the other one held where it is, or null while drawing a new line. */
  handle: { end: Handle; fixed: Point } | null;
}

/**
 * How a line is drawn across the board. With a pointer, a press and a drag
 * draws it through both points, and letting go leaves it there to adjust:
 * either end can be taken hold of and slid round the rim on its own, with the
 * other end staying put. The end follows the pointer's direction from the
 * centre, so a finger can work it from well outside the circle without
 * covering it. With the keyboard, the arrows bring a line up and then turn it
 * (left and right) or slide it (up and down). Either way nothing is cut until
 * the cut is asked for: Enter or Space on the board, or the button beside it.
 *
 * Only a shape's first cut counts, so a line can always be taken back: a drag
 * by dragging back to where the press started, by putting a second finger
 * down or by pressing the other mouse button, which puts the line from before
 * the press back, and the whole line with Escape.
 */
export function useCutGesture({ aim, lastLine, onAim, onCut }: CutGestureOptions) {
  const svgRef = useRef<SVGSVGElement>(null);
  const dragRef = useRef<Drag | null>(null);
  // Where the press landed, for the board to mark while a new line is drawn.
  const [press, setPress] = useState<Point | null>(null);
  // The end in hand, or the one the mouse is over, for the board to light up.
  const [grabbed, setGrabbed] = useState<Handle | null>(null);
  const [hovered, setHovered] = useState<Handle | null>(null);

  // The pointer's position in the board's own units, whatever size it is drawn at.
  const toBoard = (event: PointerEvent<SVGSVGElement>): Point | null => {
    const matrix = svgRef.current?.getScreenCTM();
    if (!matrix) return null;
    const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse());
    return [point.x, point.y];
  };

  // The end of the line within reach of the pointer, if either is.
  const handleAt = (event: PointerEvent<SVGSVGElement>): Handle | null => {
    const ends = aim && chord(aim, CENTER, RIM_RADIUS);
    const matrix = svgRef.current?.getScreenCTM();
    const point = toBoard(event);
    if (!ends || !matrix || !point) return null;
    // Board units to CSS pixels: the board is drawn square, so one scale does.
    const scale = Math.hypot(matrix.a, matrix.b);
    const reach = GRAB[event.pointerType] ?? GRAB.touch;
    const distances = ends.map(([x, y]) => Math.hypot(x - point[0], y - point[1]) * scale);
    const nearest: Handle = distances[0] <= distances[1] ? 0 : 1;
    return distances[nearest] <= reach ? nearest : null;
  };

  // The line with the held end moved to the rim, in the pointer's direction
  // from the centre, keeping the line's direction so its sides keep their colours.
  const lineWithEnd = (
    handle: NonNullable<Drag["handle"]>,
    event: PointerEvent<SVGSVGElement>,
  ): Line | null => {
    const point = toBoard(event);
    if (!point) return null;
    const angle = Math.atan2(point[1] - CENTER[1], point[0] - CENTER[0]);
    const moved: Point = [
      CENTER[0] + Math.cos(angle) * RIM_RADIUS,
      CENTER[1] + Math.sin(angle) * RIM_RADIUS,
    ];
    const [fx, fy] = handle.fixed;
    if (Math.hypot(moved[0] - fx, moved[1] - fy) < MIN_CHORD) return null;
    return handle.end === 0 ? { from: moved, to: handle.fixed } : { from: handle.fixed, to: moved };
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
    setGrabbed(null);
    if (svgRef.current?.hasPointerCapture(drag.pointerId)) {
      svgRef.current.releasePointerCapture(drag.pointerId);
    }
  };

  // A drag puts back the line from before it; Escape without one clears the board.
  const cancel = (by: AimSource) => {
    const before = dragRef.current?.before ?? null;
    endDrag();
    if (aim !== before) onAim(before, by);
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

    const end = handleAt(event);
    const ends = aim && chord(aim, CENTER, RIM_RADIUS);

    // The board keeps the pointer, so the drag carries on past its edge.
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      start,
      startX: event.clientX,
      startY: event.clientY,
      minDrag: MIN_DRAG[event.pointerType] ?? MIN_DRAG.touch,
      before: aim,
      handle: end !== null && ends ? { end, fixed: ends[end === 0 ? 1 : 0] } : null,
    };
    if (end !== null) setGrabbed(end);
    else setPress(start);
  };

  const onPointerMove = (event: PointerEvent<SVGSVGElement>) => {
    const drag = dragOf(event);
    if (!drag) {
      // A mouse over an end shows it can be taken hold of.
      if (!dragRef.current && event.pointerType === "mouse") setHovered(handleAt(event));
      return;
    }
    // A button pressed mid-drag arrives as a move, not as a press.
    if (event.buttons & SECONDARY_BUTTON) {
      cancel("pointer");
      return;
    }
    if (drag.handle) {
      const line = lineWithEnd(drag.handle, event);
      if (line) onAim(line, "pointer");
      return;
    }
    // A press that has not become a line yet leaves the old one standing.
    const line = lineTo(drag, event) ?? drag.before;
    if (line !== aim) onAim(line, "pointer");
  };

  // Letting go leaves the line where it is, to adjust or to cut along.
  const onPointerUp = (event: PointerEvent<SVGSVGElement>) => {
    if (dragOf(event)) endDrag();
  };

  const onPointerLeave = () => setHovered(null);

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

    // Without a line, Enter and Space are left to the game around the board.
    if (event.key === "Enter" || event.key === " ") {
      if (!aim) return;
      event.preventDefault();
      onCut(aim);
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
    /** The end in hand, or else the one the mouse is over. */
    active: grabbed ?? (aim ? hovered : null),
    /** An end is being held. */
    grabbing: grabbed !== null,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerLeave,
      onPointerCancel,
      onLostPointerCapture: onPointerCancel,
      onContextMenu,
      onKeyDown,
    },
  };
}
