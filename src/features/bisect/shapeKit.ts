/**
 * The pieces the shapes are drawn with. Each returns a closed ring, wound as a
 * solid, in the 100 by 100 box the shapes are authored in (y pointing down,
 * angles in degrees clockwise from the right). `hole` turns one inside out,
 * and overlapping solids simply merge, since the shapes fill by the nonzero
 * rule. A hole has to sit wholly inside a single solid: where two solids
 * overlap it would only take one of them away.
 */

import { bounds, type Point, type Ring, signedArea } from "./geometry";

const RADIANS = Math.PI / 180;

/** Enough points on a full turn that a circle never reads as a polygon. */
const TURN_STEPS = 96;

const toward = (angle: number, radius: number, [cx, cy]: Point): Point => [
  cx + Math.cos(angle * RADIANS) * radius,
  cy + Math.sin(angle * RADIANS) * radius,
];

/** The ring wound as a solid. */
export const solid = (ring: Ring): Ring => (signedArea(ring) >= 0 ? ring : [...ring].reverse());

/** The ring wound as a hole, to be placed inside a solid. */
export const hole = (ring: Ring): Ring => (signedArea(ring) < 0 ? ring : [...ring].reverse());

export const polygon = (points: readonly Point[]): Ring => solid(points);

/** Points along a circular arc, both ends included. */
export function arc(center: Point, radius: number, from: number, to: number): Point[] {
  const steps = Math.max(2, Math.ceil((Math.abs(to - from) / 360) * TURN_STEPS));
  return Array.from({ length: steps + 1 }, (_, i) =>
    toward(from + ((to - from) * i) / steps, radius, center),
  );
}

export const circle = (center: Point, radius: number): Ring =>
  solid(arc(center, radius, 0, 360).slice(0, -1));

export function ellipse(center: Point, rx: number, ry: number, rotation = 0): Ring {
  const turn = rotation * RADIANS;
  const points = Array.from({ length: TURN_STEPS }, (_, i): Point => {
    const t = (i / TURN_STEPS) * Math.PI * 2;
    const x = Math.cos(t) * rx;
    const y = Math.sin(t) * ry;
    return [
      center[0] + x * Math.cos(turn) - y * Math.sin(turn),
      center[1] + x * Math.sin(turn) + y * Math.cos(turn),
    ];
  });
  return solid(points);
}

/** A rectangle, its corners rounded by `radius`. */
export function rect(x: number, y: number, width: number, height: number, radius = 0): Ring {
  if (radius <= 0) {
    return solid([
      [x, y],
      [x + width, y],
      [x + width, y + height],
      [x, y + height],
    ]);
  }
  const r = Math.min(radius, width / 2, height / 2);
  return solid([
    ...arc([x + width - r, y + r], r, -90, 0),
    ...arc([x + width - r, y + height - r], r, 0, 90),
    ...arc([x + r, y + height - r], r, 90, 180),
    ...arc([x + r, y + r], r, 180, 270),
  ]);
}

/** Points along a cubic Bézier curve, both ends included. */
export function cubic(p0: Point, p1: Point, p2: Point, p3: Point, steps = 24): Point[] {
  return Array.from({ length: steps + 1 }, (_, i): Point => {
    const t = i / steps;
    const u = 1 - t;
    const a = u * u * u;
    const b = 3 * u * u * t;
    const c = 3 * u * t * t;
    const d = t * t * t;
    return [
      a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0],
      a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1],
    ];
  });
}

/** Points along a quadratic Bézier curve, both ends included. */
export function quad(p0: Point, p1: Point, p2: Point, steps = 16): Point[] {
  return Array.from({ length: steps + 1 }, (_, i): Point => {
    const t = i / steps;
    const u = 1 - t;
    return [
      u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0],
      u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1],
    ];
  });
}

/**
 * Point lists run end to end, with the point where one meets the next kept
 * only once.
 */
export function chain(...parts: readonly (readonly Point[])[]): Point[] {
  const points: Point[] = [];
  for (const part of parts) {
    for (const point of part) {
      const last = points[points.length - 1];
      if (last && Math.hypot(last[0] - point[0], last[1] - point[1]) < 1e-6) continue;
      points.push(point);
    }
  }
  return points;
}

// Past this, a sharp corner's mitre would spike out; it is held to it instead.
const MITRE_LIMIT = 3;

/**
 * A pen stroke of the given width along the points, with round ends: the
 * outline of the stroke as one ring. Corners are mitred. A curve has to bend
 * more gently than half the width, or the inside of the bend folds over.
 */
export function ribbon(points: readonly Point[], width: number): Ring {
  const path = chain(points);
  const half = width / 2;
  const unit = (x: number, y: number): Point => {
    const length = Math.hypot(x, y);
    return [x / length, y / length];
  };
  const directions = path
    .slice(1)
    .map((point, i) => unit(point[0] - path[i][0], point[1] - path[i][1]));

  const left: Point[] = [];
  const right: Point[] = [];
  path.forEach(([x, y], i) => {
    const incoming = directions[Math.max(0, i - 1)];
    const outgoing = directions[Math.min(directions.length - 1, i)];
    const [tx, ty] = unit(incoming[0] + outgoing[0], incoming[1] + outgoing[1]);
    const mitre = Math.min(MITRE_LIMIT, 1 / Math.max(tx * incoming[0] + ty * incoming[1], 1e-6));
    const nx = -ty * half * mitre;
    const ny = tx * half * mitre;
    left.push([x + nx, y + ny]);
    right.push([x - nx, y - ny]);
  });

  const normalAngle = ([tx, ty]: Point) => Math.atan2(tx, -ty) / RADIANS;
  const end = normalAngle(directions[directions.length - 1]);
  const start = normalAngle(directions[0]);

  // Round caps: from one side to the other around the end of the stroke.
  const endCap = arc(path[path.length - 1], half, end, end - 180).slice(1, -1);
  const startCap = arc(path[0], half, start + 180, start).slice(1, -1);

  return solid([...left, ...endCap, ...right.reverse(), ...startCap]);
}

/** A cog: `teeth` flat-topped teeth between the root and tip radii. */
export function gear(center: Point, tip: number, root: number, teeth: number, phase = 0): Ring {
  const pitch = 360 / teeth;
  const points: Point[] = [];
  for (let k = 0; k < teeth; k++) {
    const middle = phase + k * pitch;
    points.push(
      toward(middle - pitch * 0.3, root, center),
      toward(middle - pitch * 0.17, tip, center),
      toward(middle + pitch * 0.17, tip, center),
      toward(middle + pitch * 0.3, root, center),
    );
  }
  return solid(points);
}

/** A four-pointed sparkle, its sides curving in towards the middle. */
export function sparkle(center: Point, radius: number, pinch = 0.12): Ring {
  const tips = [0, 90, 180, 270].map((angle) => toward(angle - 90, radius, center));
  const points = tips.flatMap((tip, i) => {
    const next = tips[(i + 1) % tips.length];
    const bend = toward(i * 90 - 45, radius * pinch, center);
    return quad(tip, bend, next).slice(0, -1);
  });
  return solid(points);
}

/** Every ring turned by `angle` degrees about `pivot`. */
export function rotate(rings: readonly Ring[], angle: number, pivot: Point = [50, 50]): Ring[] {
  const cos = Math.cos(angle * RADIANS);
  const sin = Math.sin(angle * RADIANS);
  return rings.map((ring) =>
    ring.map(([x, y]): Point => {
      const dx = x - pivot[0];
      const dy = y - pivot[1];
      return [pivot[0] + dx * cos - dy * sin, pivot[1] + dx * sin + dy * cos];
    }),
  );
}

/** Every ring flipped left to right across the vertical line at `axis`. */
export const mirror = (rings: readonly Ring[], axis = 50): Ring[] =>
  rings.map((ring) => [...ring].reverse().map(([x, y]): Point => [2 * axis - x, y]));

/**
 * The rings scaled and moved so that they sit in a circle of `radius` about
 * `center`: the middle of their bounding box goes to the centre, and the
 * point furthest from it lands on the circle.
 */
export function fit(rings: readonly Ring[], center: Point, radius: number): Ring[] {
  const { minX, minY, maxX, maxY } = bounds(rings);
  const mx = (minX + maxX) / 2;
  const my = (minY + maxY) / 2;
  let reach = 0;
  for (const ring of rings) {
    for (const [x, y] of ring) reach = Math.max(reach, Math.hypot(x - mx, y - my));
  }
  const scale = radius / reach;
  return rings.map((ring) =>
    ring.map(([x, y]): Point => [center[0] + (x - mx) * scale, center[1] + (y - my) * scale]),
  );
}
