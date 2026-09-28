import { describe, expect, it } from "vitest";

import { bounds, signedArea } from "./geometry";
import { outline } from "./svgPath";

describe("outline", () => {
  it("turns each subpath into a ring", () => {
    const rings = outline("M0 0L10 0 10 10 0 10zM20 0h10v10h-10z");
    expect(rings).toHaveLength(2);
    expect(rings.map((ring) => ring.length)).toEqual([4, 4]);
  });

  it("follows relative commands from where the pen is", () => {
    const [ring] = outline("M10 10l20 0 0 20-20 0z");
    expect(bounds([ring])).toEqual({ minX: 10, minY: 10, maxX: 30, maxY: 30 });
  });

  it("starts a relative subpath where the last one closed", () => {
    const [, second] = outline("M10 10h10v10h-10zm30 0h10v10h-10z");
    expect(bounds([second])).toEqual({ minX: 40, minY: 10, maxX: 50, maxY: 20 });
  });

  it("flattens curves, a smooth one mirroring the control point before it", () => {
    // Two quarter turns of a circle of radius 10, the second one smooth.
    const k = 5.523;
    const [ring] = outline(`M0 -10c${k} 0 10 ${10 - k} 10 10s${-(10 - k)} 10 -10 10z`);
    expect(signedArea(ring)).toBeCloseTo((Math.PI * 100) / 2, 0);
  });

  it("winds solids positive and holes negative, whichever way the path ran", () => {
    const clockwise = outline("M0 0h30v30h-30zM10 10v10h10v-10z");
    const counter = outline("M0 0v30h30v-30zM10 10h10v10h-10z");
    for (const rings of [clockwise, counter]) {
      expect(rings.map((ring) => Math.sign(signedArea(ring)))).toEqual([1, -1]);
    }
  });

  it("scales the path", () => {
    expect(bounds(outline("M0 0h512v512h-512z", 100 / 512)).maxX).toBeCloseTo(100);
  });

  it("refuses a command it cannot draw", () => {
    expect(() => outline("M0 0a5 5 0 1 1 10 0z")).toThrow(/Unsupported/);
  });
});
