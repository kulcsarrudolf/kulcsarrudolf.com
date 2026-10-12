/**
 * The pictures under the blocks are drawn the way they were in 1991: an icon
 * of thirty-two by thirty-two pixels in the sixteen colours of Windows 3.1,
 * flat and bold, filling the face of the block.
 *
 * Each one is described as a few shapes (circles, rectangles, polygons and
 * strokes) on that grid, painted in order, and turned into pixels here. A
 * pixel takes the colour of the last shape whose area covers its centre, so
 * the edges come out as jagged as a 1991 icon's, and a shape can be traced
 * with a one-pixel outline the way those icons were.
 */

export const PICTURE_SIZE = 32;

/**
 * The Windows 3.1 palette, by the letter each colour is drawn with, and `.`
 * for no colour at all, which a shape uses to cut a hole in what is under it.
 * Named here rather than in the theme because they are filled into an SVG,
 * not a class.
 */
export const PALETTE = {
  k: "#000000",
  m: "#800000",
  G: "#008000",
  o: "#808000",
  n: "#000080",
  P: "#800080",
  t: "#008080",
  d: "#808080",
  s: "#c0c0c0",
  r: "#ff0000",
  g: "#00ff00",
  y: "#ffff00",
  b: "#0000ff",
  p: "#ff00ff",
  c: "#00ffff",
  w: "#ffffff",
} as const satisfies Record<string, string>;

export type Colour = keyof typeof PALETTE | ".";

type Point = readonly [number, number];

interface Paint {
  fill: Colour;
  /** A one-pixel line traced around the outside of the shape. */
  outline?: Colour;
}

export type Shape = Paint &
  (
    | { kind: "ellipse"; cx: number; cy: number; rx: number; ry: number }
    | { kind: "rect"; x: number; y: number; width: number; height: number }
    | { kind: "polygon"; points: readonly Point[] }
  );

export interface Picture {
  id: string;
  shapes: readonly Shape[];
}

// The shapes, in the grid's own units: (0, 0) is the top left corner of the
// picture and (32, 32) the bottom right.

export const circle = (
  cx: number,
  cy: number,
  r: number,
  fill: Colour,
  outline?: Colour,
): Shape => ({
  kind: "ellipse",
  cx,
  cy,
  rx: r,
  ry: r,
  fill,
  outline,
});

export const ellipse = (
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  fill: Colour,
  outline?: Colour,
): Shape => ({ kind: "ellipse", cx, cy, rx, ry, fill, outline });

export const rect = (
  x: number,
  y: number,
  width: number,
  height: number,
  fill: Colour,
  outline?: Colour,
): Shape => ({ kind: "rect", x, y, width, height, fill, outline });

export const polygon = (points: readonly Point[], fill: Colour, outline?: Colour): Shape => ({
  kind: "polygon",
  points,
  fill,
  outline,
});

/** A straight stroke of the given width, from one point to the other. */
export function line(from: Point, to: Point, width: number, fill: Colour): Shape {
  const [x1, y1] = from;
  const [x2, y2] = to;
  const length = Math.hypot(x2 - x1, y2 - y1) || 1;
  const nx = (-(y2 - y1) / length) * (width / 2);
  const ny = ((x2 - x1) / length) * (width / 2);
  return polygon(
    [
      [x1 + nx, y1 + ny],
      [x2 + nx, y2 + ny],
      [x2 - nx, y2 - ny],
      [x1 - nx, y1 - ny],
    ],
    fill,
  );
}

/** The corners of a regular polygon, the first one straight up unless turned. */
export function regular(sides: number, cx: number, cy: number, r: number, turn = 0): Point[] {
  return Array.from({ length: sides }, (_, i) => {
    const angle = turn + (i * 2 * Math.PI) / sides - Math.PI / 2;
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)] as const;
  });
}

/** The points of a star, alternating between the outer and the inner radius. */
export function star(
  points: number,
  cx: number,
  cy: number,
  outer: number,
  inner: number,
): Point[] {
  return Array.from({ length: points * 2 }, (_, i) => {
    const r = i % 2 === 0 ? outer : inner;
    const angle = (i * Math.PI) / points - Math.PI / 2;
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)] as const;
  });
}

function covers(shape: Shape, x: number, y: number): boolean {
  switch (shape.kind) {
    case "ellipse":
      return ((x - shape.cx) / shape.rx) ** 2 + ((y - shape.cy) / shape.ry) ** 2 <= 1;
    case "rect":
      return (
        x >= shape.x && x <= shape.x + shape.width && y >= shape.y && y <= shape.y + shape.height
      );
    case "polygon": {
      // Even-odd ray casting: a point is inside when a ray from it crosses the edges an odd number of times.
      let inside = false;
      const { points } = shape;
      for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
        const [xi, yi] = points[i];
        const [xj, yj] = points[j];
        if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
      }
      return inside;
    }
  }
}

/** The picture as a grid of palette letters, one row per string, `.` where nothing is painted. */
export function rasterize(picture: Picture): string[] {
  const size = PICTURE_SIZE;
  const grid = Array.from({ length: size }, () => Array<string>(size).fill("."));

  for (const shape of picture.shapes) {
    const inside = Array.from({ length: size }, (_, y) =>
      Array.from({ length: size }, (_, x) => covers(shape, x + 0.5, y + 0.5)),
    );

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (inside[y][x]) grid[y][x] = shape.fill;
      }
    }

    const { outline } = shape;
    if (!outline) continue;
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (inside[y][x]) continue;
        const touches =
          inside[y - 1]?.[x] || inside[y + 1]?.[x] || inside[y][x - 1] || inside[y][x + 1];
        if (touches) grid[y][x] = outline;
      }
    }
  }

  return grid.map((row) => row.join(""));
}

/** One run of same-coloured pixels on a row, which is one `<rect>` to draw. */
export interface Run {
  x: number;
  y: number;
  width: number;
  fill: string;
}

/**
 * The picture as runs of colour, so a row of eight red pixels is one rectangle
 * rather than eight. What is left unpainted stays transparent.
 */
export function runsOf(picture: Picture): Run[] {
  const runs: Run[] = [];

  rasterize(picture).forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const letter = row[x];
      let end = x + 1;
      while (row[end] === letter) end++;
      const fill: string | undefined = PALETTE[letter as keyof typeof PALETTE];
      if (fill) runs.push({ x, y, width: end - x, fill });
      x = end;
    }
  });

  return runs;
}
