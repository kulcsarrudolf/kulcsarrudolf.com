/**
 * The arithmetic behind a cut: which part of a shape falls on each side of a
 * line, and where that line crosses the board's circle.
 *
 * A shape is a list of closed rings filled by the nonzero rule, the same rule
 * the SVG draws it with, so what is scored is exactly what is on screen:
 * rings wound the same way add up into one solid, and a ring wound the other
 * way cuts a hole out of the solid it sits in.
 */

export type Point = readonly [number, number];
export type Ring = readonly Point[];

/** A line through two distinct points, extended both ways without end. */
export interface Line {
  from: Point;
  to: Point;
}

/**
 * A shape sliced into thin horizontal rows. Each row holds the filled spans
 * along it as flat `[start, end, start, end, …]` pairs, which is everything
 * a straight cut needs to know: a line crosses a row at one point, so the
 * area on either side is a sum of span lengths.
 */
export interface Strips {
  /** The y of the first row's centre. */
  top: number;
  /** The height of one row. */
  step: number;
  rows: number[][];
}

/** How much of a shape one side of a cut holds, and where its middle is. */
export interface Part {
  /** Its share of the whole shape, from 0 to 1. */
  share: number;
  /** Its centre of mass, where its label goes. Null when the part is empty. */
  centroid: Point | null;
}

/** Enough rows that the shares are right to a few hundredths of a percent. */
export const DEFAULT_ROWS = 1200;

const EPSILON = 1e-9;

/**
 * The signed area of a ring, by the shoelace formula. Its sign is the ring's
 * winding, which is what tells a solid from a hole.
 */
export function signedArea(ring: Ring): number {
  let sum = 0;
  for (let i = 0; i < ring.length; i++) {
    const [x0, y0] = ring[i];
    const [x1, y1] = ring[(i + 1) % ring.length];
    sum += x0 * y1 - x1 * y0;
  }
  return sum / 2;
}

/** The smallest box around every point of every ring. */
export function bounds(rings: readonly Ring[]) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const ring of rings) {
    for (const [x, y] of ring) {
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }
  return { minX, minY, maxX, maxY };
}

/**
 * Slices the rings into `rowCount` rows and finds the filled spans on each.
 * Every edge drops its crossing into the rows it spans, carrying +1 or -1 for
 * the way it runs; walking a row left to right and adding those up gives the
 * winding number, and a span is filled wherever that is not zero.
 */
export function rasterize(rings: readonly Ring[], rowCount = DEFAULT_ROWS): Strips {
  const { minY, maxY } = bounds(rings);
  const step = (maxY - minY) / rowCount;
  const top = minY + step / 2;
  const crossings: [number, number][][] = Array.from({ length: rowCount }, () => []);

  for (const ring of rings) {
    for (let i = 0; i < ring.length; i++) {
      const [ax, ay] = ring[i];
      const [bx, by] = ring[(i + 1) % ring.length];
      if (ay === by) continue;

      const direction = by > ay ? 1 : -1;
      const low = Math.min(ay, by);
      const high = Math.max(ay, by);

      // The rows whose centre lies in [low, high): half-open, so a vertex
      // shared by two edges is counted once rather than twice.
      const first = Math.max(0, Math.ceil((low - top) / step));
      const last = Math.min(rowCount - 1, Math.ceil((high - top) / step) - 1);

      for (let row = first; row <= last; row++) {
        const y = top + row * step;
        const x = ax + ((y - ay) / (by - ay)) * (bx - ax);
        crossings[row].push([x, direction]);
      }
    }
  }

  const rows = crossings.map((row) => {
    row.sort((a, b) => a[0] - b[0]);
    const spans: number[] = [];
    let winding = 0;
    let start = 0;
    for (const [x, direction] of row) {
      const before = winding;
      winding += direction;
      if (before === 0 && winding !== 0) start = x;
      else if (before !== 0 && winding === 0 && x > start) spans.push(start, x);
    }
    return spans;
  });

  return { top, step, rows };
}

/**
 * A side of a line: 1 where the cross product of the line's direction with
 * the way to a point is positive, -1 where it is negative.
 */
export type Side = 1 | -1;

/**
 * Splits the shape by the line and weighs both sides: the part on side 1
 * first, then the part on side -1.
 */
export function split(strips: Strips, line: Line): [Part, Part] {
  const [fx, fy] = line.from;
  const dx = line.to[0] - fx;
  const dy = line.to[1] - fy;

  // Area, and its first moments in x and y, for each side.
  const positive = [0, 0, 0];
  const negative = [0, 0, 0];

  const add = (side: number[], x0: number, x1: number, y: number) => {
    const area = (x1 - x0) * strips.step;
    side[0] += area;
    side[1] += area * ((x0 + x1) / 2);
    side[2] += area * y;
  };

  strips.rows.forEach((spans, index) => {
    const y = strips.top + index * strips.step;

    // Which side a point lands on is the sign of the cross product
    // dx * (y - fy) - dy * (x - fx). Along one row that is a constant minus
    // dy * x, so it changes sign at a single x, or never if the line is
    // horizontal.
    const constant = dx * (y - fy) + dy * fx;

    for (let i = 0; i < spans.length; i += 2) {
      const x0 = spans[i];
      const x1 = spans[i + 1];

      if (Math.abs(dy) < EPSILON) {
        add(constant > 0 ? positive : negative, x0, x1, y);
        continue;
      }

      const cross = constant / dy;
      // Side 1 is x < cross when dy > 0, and x > cross when dy < 0.
      const [before, after] = dy > 0 ? [positive, negative] : [negative, positive];
      const middle = Math.min(Math.max(cross, x0), x1);
      if (middle > x0) add(before, x0, middle, y);
      if (x1 > middle) add(after, middle, x1, y);
    }
  });

  const total = positive[0] + negative[0];
  const part = ([area, mx, my]: number[]): Part => ({
    share: total > 0 ? area / total : 0,
    centroid: area > 0 ? [mx / area, my / area] : null,
  });

  return [part(positive), part(negative)];
}

/**
 * Where the line enters and leaves a circle, or null when it misses it. The
 * points come back in the line's own direction.
 */
export function chord(line: Line, center: Point, radius: number): [Point, Point] | null {
  const [fx, fy] = line.from;
  const dx = line.to[0] - fx;
  const dy = line.to[1] - fy;
  const length = Math.hypot(dx, dy);
  if (length < EPSILON) return null;

  const ux = dx / length;
  const uy = dy / length;
  // The foot of the perpendicular from the centre, measured along the line.
  const along = (center[0] - fx) * ux + (center[1] - fy) * uy;
  const footX = fx + ux * along;
  const footY = fy + uy * along;
  const distance = Math.hypot(center[0] - footX, center[1] - footY);
  if (distance >= radius) return null;

  const half = Math.sqrt(radius * radius - distance * distance);
  return [
    [footX - ux * half, footY - uy * half],
    [footX + ux * half, footY + uy * half],
  ];
}

/**
 * A line given by its direction and its distance from a centre point, which
 * is how the keyboard moves one: the arrows turn it and slide it sideways.
 * `angle` is in degrees, 0 pointing right and 90 pointing down the screen,
 * and a positive `offset` slides the line towards its side -1.
 */
export function lineAt(center: Point, angle: number, offset: number): Line {
  const radians = (angle * Math.PI) / 180;
  const ux = Math.cos(radians);
  const uy = Math.sin(radians);
  const x = center[0] + uy * offset;
  const y = center[1] - ux * offset;
  return { from: [x - ux, y - uy], to: [x + ux, y + uy] };
}

/**
 * The direction and offset `lineAt` would need to draw the same line, so the
 * keyboard can carry on from a line the pointer drew.
 */
export function aimOf(center: Point, line: Line): { angle: number; offset: number } {
  const [fx, fy] = line.from;
  const dx = line.to[0] - fx;
  const dy = line.to[1] - fy;
  const length = Math.hypot(dx, dy);
  const ux = dx / length;
  const uy = dy / length;
  return {
    angle: (Math.atan2(uy, ux) * 180) / Math.PI,
    offset: (fx - center[0]) * uy - (fy - center[1]) * ux,
  };
}

/**
 * The line turned about its start to the nearest multiple of `step` degrees,
 * its length kept: what holding Shift does to a line drawn with the mouse.
 */
export function snapped(line: Line, step: number): Line {
  const [fx, fy] = line.from;
  const dx = line.to[0] - fx;
  const dy = line.to[1] - fy;
  const length = Math.hypot(dx, dy);
  const degrees = (Math.atan2(dy, dx) * 180) / Math.PI;
  const radians = (Math.round(degrees / step) * step * Math.PI) / 180;
  return {
    from: line.from,
    to: [fx + Math.cos(radians) * length, fy + Math.sin(radians) * length],
  };
}

/**
 * A quadrilateral covering everything on one side of the line out to
 * `reach`, for clipping the drawing of that side.
 */
export function halfPlane(line: Line, side: Side, reach: number): Ring {
  const [fx, fy] = line.from;
  const dx = line.to[0] - fx;
  const dy = line.to[1] - fy;
  const length = Math.hypot(dx, dy);
  const ux = dx / length;
  const uy = dy / length;
  // The normal towards the side: its cross product with the direction has
  // the side's sign.
  const nx = -uy * side;
  const ny = ux * side;

  const ax = fx - ux * reach;
  const ay = fy - uy * reach;
  const bx = fx + ux * reach;
  const by = fy + uy * reach;
  return [
    [ax, ay],
    [bx, by],
    [bx + nx * reach, by + ny * reach],
    [ax + nx * reach, ay + ny * reach],
  ];
}

/** The rings as an SVG path, to be filled with the nonzero rule. */
export function toPath(rings: readonly Ring[]): string {
  const round = (value: number) => Math.round(value * 100) / 100;
  return rings
    .map((ring) => `M${ring.map(([x, y]) => `${round(x)} ${round(y)}`).join("L")}Z`)
    .join("");
}
