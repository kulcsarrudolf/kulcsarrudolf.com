/**
 * The board a shape is cut on: a circle in a 200 by 200 SVG box, the shape
 * sitting inside it, and what a cut across it comes to.
 */

import { type Line, type Part, type Point, type Ring, rasterize, split, toPath } from "./geometry";
import { fit } from "./shapeKit";
import type { ShapeDefinition } from "./shapes";

export const BOARD_SIZE = 200;
export const CENTER: Point = [BOARD_SIZE / 2, BOARD_SIZE / 2];
/** The circle the cut runs across. */
export const RIM_RADIUS = 94;
/** How far from the centre a shape may reach, leaving room inside the rim. */
const SHAPE_RADIUS = 72;

/**
 * Shares are counted in tenths of a percent, the precision the player reads
 * them at, so the verdict always agrees with the numbers on screen.
 */
const WHOLE = 1000;
/** A smaller part within this many tenths of a percent of half is perfect. */
export const PERFECT_MARGIN = 5;
/** Within this many it wins, which is 48:52 or better. */
export const WIN_MARGIN = 20;

export type Verdict = "perfect" | "win" | "miss";

export interface PlacedShape {
  id: string;
  rings: Ring[];
  /** The rings as one SVG path, to be filled with the nonzero rule. */
  path: string;
}

export interface Cut {
  line: Line;
  /** The two sides of the cut, the side-1 part first. */
  parts: [Part, Part];
  /** The two shares in tenths of a percent, adding up to exactly 1000. */
  tenths: [number, number];
  /** How many tenths of a percent the smaller part falls short of half. */
  offBy: number;
  verdict: Verdict;
}

const placed = new Map<string, PlacedShape>();
const strips = new Map<string, ReturnType<typeof rasterize>>();

/** The shape scaled into the board, drawn once and remembered. */
export function place(shape: ShapeDefinition): PlacedShape {
  let result = placed.get(shape.id);
  if (!result) {
    const rings = fit(shape.draw(), CENTER, SHAPE_RADIUS);
    result = { id: shape.id, rings, path: toPath(rings) };
    placed.set(shape.id, result);
  }
  return result;
}

export function verdictFor(offBy: number): Verdict {
  if (offBy <= PERFECT_MARGIN) return "perfect";
  if (offBy <= WIN_MARGIN) return "win";
  return "miss";
}

/** What cutting the shape along the line comes to. */
export function cut(shape: PlacedShape, line: Line): Cut {
  let sliced = strips.get(shape.id);
  if (!sliced) {
    sliced = rasterize(shape.rings);
    strips.set(shape.id, sliced);
  }
  const parts = split(sliced, line);
  const first = Math.round(parts[0].share * WHOLE);
  const tenths: [number, number] = [first, WHOLE - first];
  const offBy = WHOLE / 2 - Math.min(...tenths);
  return { line, parts, tenths, offBy, verdict: verdictFor(offBy) };
}

/** Tenths of a percent as the player reads them: `48.3`. */
export const formatTenths = (tenths: number) => (tenths / 10).toFixed(1);
