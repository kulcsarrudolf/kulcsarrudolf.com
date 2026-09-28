import { type KeyboardEvent, type PointerEvent, useCallback, useRef } from "react";

import { CENTER, RIM_RADIUS } from "./board";
import { aimOf, chord, type Line, lineAt, type Point } from "./geometry";

/** A press that moves less than this, in board units, is a click, not a cut. */
const MIN_DRAG = 6;
/** Degrees per arrow press, and with Shift held. */
const TURN = 2;
const TURN_FAST = 10;
/** Board units per arrow press, and with Shift held. */
const SLIDE = 1;
const SLIDE_FAST = 5;
/** Where the keyboard's line starts when there is none on the board yet. */
const KEYBOARD_START = { angle: 90, offset: 0 };

interface CutGestureOptions {
  /** The line being drawn, if any. */
  aim: Line | null;
  /** The line of the cut on the board, if any: the keyboard carries on from it. */
  lastLine: Line | null;
  onAim: (line: Line | null) => void;
  onCut: (line: Line) => void;
}

/**
 * How a line is drawn across the board. With a pointer, a press and a drag
 * draws it through both points and letting go cuts, the way Cutle plays. With
 * the keyboard, the arrows bring a line up and then turn it (left and right)
 * or slide it (up and down), and Enter or Space cuts along it.
 */
export function useCutGesture({ aim, lastLine, onAim, onCut }: CutGestureOptions) {
  const svgRef = useRef<SVGSVGElement>(null);
  const startRef = useRef<Point | null>(null);

  // The pointer's position in the board's own units, whatever size it is drawn at.
  const toBoard = (event: PointerEvent<SVGSVGElement>): Point | null => {
    const matrix = svgRef.current?.getScreenCTM();
    if (!matrix) return null;
    const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse());
    return [point.x, point.y];
  };

  // The line from where the press started to the pointer, once it is long
  // enough to mean something and crosses the circle.
  const lineTo = (event: PointerEvent<SVGSVGElement>): Line | null => {
    const start = startRef.current;
    const end = toBoard(event);
    if (!start || !end) return null;
    if (Math.hypot(end[0] - start[0], end[1] - start[1]) < MIN_DRAG) return null;
    const line = { from: start, to: end };
    return chord(line, CENTER, RIM_RADIUS) ? line : null;
  };

  const onPointerDown = (event: PointerEvent<SVGSVGElement>) => {
    if (event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    startRef.current = toBoard(event);
  };

  const onPointerMove = (event: PointerEvent<SVGSVGElement>) => {
    if (!startRef.current) return;
    const line = lineTo(event);
    if (line) onAim(line);
  };

  const onPointerUp = (event: PointerEvent<SVGSVGElement>) => {
    if (!startRef.current) return;
    const line = lineTo(event);
    startRef.current = null;
    if (line) onCut(line);
    else if (aim) onAim(null);
  };

  const onPointerCancel = () => {
    startRef.current = null;
    if (aim) onAim(null);
  };

  const onKeyDown = useCallback(
    (event: KeyboardEvent<SVGSVGElement>) => {
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
        onAim(lineAt(CENTER, KEYBOARD_START.angle, KEYBOARD_START.offset));
        return;
      }
      const { angle, offset } = aimOf(CENTER, current);
      const reach = RIM_RADIUS - 1;
      const moved = Math.min(reach, Math.max(-reach, offset + move[1]));
      onAim(lineAt(CENTER, angle + move[0], moved));
    },
    [aim, lastLine, onAim, onCut],
  );

  return {
    svgRef,
    handlers: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel, onKeyDown },
  };
}
