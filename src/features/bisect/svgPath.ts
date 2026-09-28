/**
 * A logo too intricate to build from circles and pen strokes is traced from
 * its SVG path instead: every subpath becomes a ring, its curves flattened
 * into points. Elliptical arcs are the one command left out, since no logo
 * here draws with them.
 */

import { type Point, type Ring, signedArea } from "./geometry";
import { chain, cubic, quad } from "./shapeKit";

const TOKEN = /([a-zA-Z])|(-?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?)/g;

/** How many numbers each command takes at a time. */
const ARITY: Record<string, number> = { m: 2, l: 2, h: 1, v: 1, c: 6, s: 4, q: 4, t: 2, z: 0 };

interface Command {
  /** The letter as written: lowercase is relative to the pen. */
  letter: string;
  values: number[];
}

function commands(d: string): Command[] {
  const result: Command[] = [];
  let letter = "";
  let values: number[] = [];
  const flush = () => {
    const arity = ARITY[letter.toLowerCase()];
    if (arity === undefined) throw new Error(`Unsupported path command "${letter}"`);
    if (arity === 0) {
      result.push({ letter, values: [] });
      return;
    }
    for (let i = 0; i + arity <= values.length; i += arity) {
      // Coordinates running on after a move are lines to the next points.
      const implied = letter === "m" ? "l" : letter === "M" ? "L" : letter;
      result.push({ letter: i === 0 ? letter : implied, values: values.slice(i, i + arity) });
    }
  };
  for (const [, word, number] of d.matchAll(TOKEN)) {
    if (word) {
      if (letter) flush();
      letter = word;
      values = [];
    } else {
      values.push(Number(number));
    }
  }
  if (letter) flush();
  return result;
}

/**
 * The rings of an SVG path, scaled by `scale` and wound the way the kit
 * expects: solids as solids, holes as holes.
 */
export function outline(d: string, scale = 1): Ring[] {
  const rings: Point[][] = [];
  let ring: Point[] = [];
  let pen: Point = [0, 0];
  let start: Point = [0, 0];
  // The last control point, which a smooth curve mirrors through the pen.
  let control: Point | null = null;
  let curve = "";

  const close = () => {
    const points = chain(ring);
    const [first] = points;
    const last = points[points.length - 1];
    if (points.length > 1 && Math.hypot(first[0] - last[0], first[1] - last[1]) < 1e-6) {
      points.pop();
    }
    if (points.length > 2) rings.push(points);
    ring = [];
  };

  for (const { letter, values } of commands(d)) {
    const kind = letter.toLowerCase();
    const relative = letter === kind;
    const point = (i: number): Point =>
      relative ? [pen[0] + values[i], pen[1] + values[i + 1]] : [values[i], values[i + 1]];
    const mirrored = (after: string): Point =>
      control && curve === after ? [2 * pen[0] - control[0], 2 * pen[1] - control[1]] : pen;

    let next: Point = pen;
    let bend: Point | null = null;

    if (kind === "z") {
      close();
      next = start;
    } else if (kind === "m") {
      close();
      next = point(0);
      start = next;
      ring.push(next);
    } else if (kind === "l") {
      next = point(0);
      ring.push(next);
    } else if (kind === "h") {
      next = [relative ? pen[0] + values[0] : values[0], pen[1]];
      ring.push(next);
    } else if (kind === "v") {
      next = [pen[0], relative ? pen[1] + values[0] : values[0]];
      ring.push(next);
    } else if (kind === "c" || kind === "s") {
      const first = kind === "c" ? point(0) : mirrored("c");
      const offset = kind === "c" ? 2 : 0;
      bend = point(offset);
      next = point(offset + 2);
      ring.push(...cubic(pen, first, bend, next).slice(1));
    } else {
      bend = kind === "q" ? point(0) : mirrored("q");
      next = point(kind === "q" ? 2 : 0);
      ring.push(...quad(pen, bend, next).slice(1));
    }

    if (ring.length === 0 && kind !== "z") ring.push(pen);
    control = bend;
    curve = kind === "s" ? "c" : kind === "t" ? "q" : kind;
    pen = next;
  }
  close();

  const scaled = rings.map((points) => points.map(([x, y]): Point => [x * scale, y * scale]));
  const total = scaled.reduce((sum, points) => sum + signedArea(points), 0);
  return total >= 0 ? scaled : scaled.map((points) => [...points].reverse());
}
