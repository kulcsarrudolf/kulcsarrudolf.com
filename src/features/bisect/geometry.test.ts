import { describe, expect, it } from "vitest";

import {
  aimOf,
  chord,
  halfPlane,
  type Line,
  lineAt,
  type Point,
  rasterize,
  type Ring,
  signedArea,
  split,
} from "./geometry";

const square = (x: number, y: number, size: number): Ring => [
  [x, y],
  [x + size, y],
  [x + size, y + size],
  [x, y + size],
];

const reversed = (ring: Ring): Ring => [...ring].reverse();

// A vertical line through x, running down the screen: side 1 is to its left.
const vertical = (x: number): Line => ({ from: [x, 0], to: [x, 1] });

const shares = (rings: Ring[], line: Line) => split(rasterize(rings), line).map((p) => p.share);

describe("signedArea", () => {
  it("measures a ring, its sign following the winding", () => {
    expect(signedArea(square(0, 0, 10))).toBe(100);
    expect(signedArea(reversed(square(0, 0, 10)))).toBe(-100);
  });
});

describe("split", () => {
  it("weighs the two sides of a square cut off-centre", () => {
    const [left, right] = shares([square(0, 0, 10)], vertical(3));
    expect(left).toBeCloseTo(0.3, 6);
    expect(right).toBeCloseTo(0.7, 6);
  });

  it("swaps the sides when the line runs the other way", () => {
    const [first] = shares([square(0, 0, 10)], { from: [3, 1], to: [3, 0] });
    expect(first).toBeCloseTo(0.7, 6);
  });

  it("handles a horizontal cut, where side 1 lies below a line running right", () => {
    const [below] = shares([square(0, 0, 10)], { from: [0, 4], to: [1, 4] });
    expect(below).toBeCloseTo(0.6, 6);
  });

  it("halves a square along its diagonal", () => {
    const [first] = shares([square(0, 0, 10)], { from: [0, 0], to: [10, 10] });
    expect(first).toBeCloseTo(0.5, 3);
  });

  it("leaves a hole out of both sides", () => {
    // 100 minus a 2 by 6 hole, all of it left of the cut at x = 5.
    const rings = [
      square(0, 0, 10),
      reversed([
        [2, 2],
        [4, 2],
        [4, 8],
        [2, 8],
      ] as Ring),
    ];
    const [left] = shares(rings, vertical(5));
    expect(left).toBeCloseTo(38 / 88, 4);
  });

  it("counts overlapping solids once, as their union", () => {
    const [left, right] = shares([square(0, 0, 10), square(5, 0, 10)], vertical(7.5));
    expect(left).toBeCloseTo(0.5, 6);
    expect(right).toBeCloseTo(0.5, 6);
  });

  it("gives everything to one side when the line misses the shape", () => {
    const [left, right] = split(rasterize([square(0, 0, 10)]), vertical(20));
    expect(left.share).toBe(1);
    expect(right.share).toBe(0);
    expect(right.centroid).toBeNull();
  });

  it("finds the centre of mass of each part", () => {
    const [left, right] = split(rasterize([square(0, 0, 10)]), vertical(4));
    expect(left.centroid?.[0]).toBeCloseTo(2, 4);
    expect(left.centroid?.[1]).toBeCloseTo(5, 4);
    expect(right.centroid?.[0]).toBeCloseTo(7, 4);
  });
});

describe("chord", () => {
  it("returns where the line crosses the circle, in the line's direction", () => {
    const ends = chord({ from: [0, 5], to: [1, 5] }, [5, 5], 5);
    expect(ends?.[0][0]).toBeCloseTo(0, 9);
    expect(ends?.[1][0]).toBeCloseTo(10, 9);
  });

  it("returns null for a line that misses the circle", () => {
    expect(chord(vertical(20), [5, 5], 5)).toBeNull();
  });
});

describe("lineAt and aimOf", () => {
  const center: Point = [100, 100];

  it("draws a line through the centre at no offset", () => {
    const line = lineAt(center, 90, 0);
    expect(line.from[0]).toBeCloseTo(100, 9);
    expect(line.to[0]).toBeCloseTo(100, 9);
    expect(line.to[1]).toBeGreaterThan(line.from[1]);
  });

  it("reads back the angle and offset a line was drawn with", () => {
    const { angle, offset } = aimOf(center, lineAt(center, 30, 12));
    expect(angle).toBeCloseTo(30, 9);
    expect(offset).toBeCloseTo(12, 9);
  });
});

describe("halfPlane", () => {
  it("covers the requested side of the line", () => {
    const line = vertical(5);
    const left = halfPlane(line, 1, 100);
    const right = halfPlane(line, -1, 100);
    expect(Math.max(...left.map(([x]) => x))).toBeCloseTo(5, 9);
    expect(Math.min(...right.map(([x]) => x))).toBeCloseTo(5, 9);
  });
});
