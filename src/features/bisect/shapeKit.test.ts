import { describe, expect, it } from "vitest";

import { bounds, rasterize, signedArea, split } from "./geometry";
import { circle, fit, hole, mirror, rect, ribbon, rotate } from "./shapeKit";

const area = (rings: Parameters<typeof rasterize>[0]) => {
  // Every point is on one side of a line far to the right, so side 1 is the
  // whole shape; its area is the sum of the rings' signed areas.
  const [whole] = split(rasterize(rings), { from: [1000, 0], to: [1000, 1] });
  expect(whole.share).toBe(1);
  return rings.reduce((sum, ring) => sum + signedArea(ring), 0);
};

describe("shapeKit", () => {
  it("winds solids positive and holes negative", () => {
    expect(signedArea(circle([0, 0], 10))).toBeGreaterThan(0);
    expect(signedArea(hole(circle([0, 0], 10)))).toBeLessThan(0);
  });

  it("draws a circle close to its true area", () => {
    expect(signedArea(circle([50, 50], 10))).toBeCloseTo(Math.PI * 100, 0);
  });

  it("rounds a rectangle's corners", () => {
    const r = 5;
    expect(signedArea(rect(0, 0, 40, 20, r))).toBeCloseTo(800 - (4 - Math.PI) * r * r, 0);
  });

  it("strokes a straight line as a capsule", () => {
    const stroke = ribbon(
      [
        [0, 0],
        [30, 0],
      ],
      6,
    );
    expect(signedArea(stroke)).toBeCloseTo(30 * 6 + Math.PI * 9, 0);
  });

  it("mirrors and rotates without turning solids into holes", () => {
    const shape = [rect(10, 10, 20, 30)];
    expect(signedArea(mirror(shape)[0])).toBeGreaterThan(0);
    expect(signedArea(rotate(shape, 37)[0])).toBeCloseTo(600, 6);
    expect(area(shape)).toBeCloseTo(600, 6);
  });

  it("fits rings inside a circle about a centre", () => {
    const fitted = fit([rect(0, 0, 30, 40)], [100, 100], 50);
    const furthest = Math.max(...fitted[0].map(([x, y]) => Math.hypot(x - 100, y - 100)));
    expect(furthest).toBeCloseTo(50, 9);
    const { minX, maxX } = bounds(fitted);
    expect((minX + maxX) / 2).toBeCloseTo(100, 9);
  });
});
