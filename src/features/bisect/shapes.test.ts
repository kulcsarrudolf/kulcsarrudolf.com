import { describe, expect, it } from "vitest";

import { CENTER, cut, place, RIM_RADIUS } from "./board";
import { lineAt, signedArea } from "./geometry";
import { SHAPES } from "./shapes";

describe("SHAPES", () => {
  it("holds forty shapes under distinct kebab-case names", () => {
    expect(SHAPES).toHaveLength(40);
    const ids = SHAPES.map((shape) => shape.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  describe.each(SHAPES.map((shape) => [shape.id, shape] as const))("%s", (_, shape) => {
    const placed = place(shape);

    it("sits inside the rim with room to spare", () => {
      for (const ring of placed.rings) {
        for (const [x, y] of ring) {
          expect(Math.hypot(x - CENTER[0], y - CENTER[1])).toBeLessThan(RIM_RADIUS - 10);
        }
      }
    });

    it("has a solid area once its holes are taken out", () => {
      const total = placed.rings.reduce((sum, ring) => sum + signedArea(ring), 0);
      expect(total).toBeGreaterThan(0);
    });

    it("can be cut perfectly in half, which a bisection finds", () => {
      // Sliding a vertical line across the board moves the share on its
      // side 1 steadily from none of the shape to all of it, so halving the
      // range of offsets closes in on the one that splits it evenly.
      let low = -RIM_RADIUS;
      let high = RIM_RADIUS;
      for (let step = 0; step < 40; step++) {
        const middle = (low + high) / 2;
        const [first] = cut(placed, lineAt(CENTER, 90, middle)).parts;
        if (first.share > 0.5) high = middle;
        else low = middle;
      }
      expect(cut(placed, lineAt(CENTER, 90, low)).verdict).toBe("perfect");
    });
  });
});
