import { describe, expect, it } from "vitest";

import { CENTER, cut, formatTenths, place, RIM_RADIUS, verdictFor } from "./board";
import { lineAt } from "./geometry";
import { rect } from "./shapeKit";

// A plain square, so the expected shares can be worked out by hand.
const square = place({ id: "test-square", draw: () => [rect(0, 0, 10, 10)] });

describe("verdictFor", () => {
  it("calls 49.5 or better perfect, 48.0 or better a win, and anything else a miss", () => {
    expect(verdictFor(0)).toBe("perfect");
    expect(verdictFor(5)).toBe("perfect");
    expect(verdictFor(6)).toBe("win");
    expect(verdictFor(20)).toBe("win");
    expect(verdictFor(21)).toBe("miss");
  });
});

describe("place", () => {
  it("scales the shape into the board and remembers it", () => {
    for (const ring of square.rings) {
      for (const [x, y] of ring) {
        expect(Math.hypot(x - CENTER[0], y - CENTER[1])).toBeLessThan(RIM_RADIUS);
      }
    }
    expect(place({ id: "test-square", draw: () => [] })).toBe(square);
  });
});

describe("cut", () => {
  it("scores a cut through the middle as perfect", () => {
    const result = cut(square, lineAt(CENTER, 90, 0));
    expect(result.tenths).toEqual([500, 500]);
    expect(result.offBy).toBe(0);
    expect(result.verdict).toBe("perfect");
  });

  it("keeps the two shares adding up to exactly 100%", () => {
    for (const offset of [3, 7.77, 13.1, 20]) {
      const { tenths } = cut(square, lineAt(CENTER, 72, offset));
      expect(tenths[0] + tenths[1]).toBe(1000);
    }
  });

  it("scores a cut that misses the shape as the worst miss there is", () => {
    const result = cut(square, lineAt(CENTER, 90, RIM_RADIUS - 1));
    expect(result.offBy).toBe(500);
    expect(result.verdict).toBe("miss");
  });
});

describe("formatTenths", () => {
  it("prints tenths of a percent with one decimal", () => {
    expect(formatTenths(483)).toBe("48.3");
    expect(formatTenths(500)).toBe("50.0");
  });
});
