import { describe, expect, it } from "vitest";

import { PAIRS } from "./engine";
import { PALETTE, PICTURE_SIZE, rasterize, rect, runsOf } from "./picture";
import { PICTURES } from "./pictures";

describe("PICTURES", () => {
  it("has a picture for every pair of the largest board, each under its own name", () => {
    expect(PICTURES.length).toBeGreaterThanOrEqual(Math.max(...Object.values(PAIRS)));
    expect(new Set(PICTURES.map(({ id }) => id)).size).toBe(PICTURES.length);
  });

  it.each(PICTURES.map((picture) => [picture.id, picture] as const))(
    "paints %s inside the grid, in the palette",
    (_, picture) => {
      const rows = rasterize(picture);
      expect(rows).toHaveLength(PICTURE_SIZE);
      for (const row of rows) {
        expect(row).toHaveLength(PICTURE_SIZE);
        for (const letter of row) expect(letter === "." || letter in PALETTE).toBe(true);
      }
      // Something to see, and a white margin's worth of room left at the edges.
      expect(rows.join("").replace(/\./g, "").length).toBeGreaterThan(PICTURE_SIZE * 4);
    },
  );

  it("never draws two pictures the same", () => {
    const drawings = PICTURES.map((picture) => rasterize(picture).join(""));
    expect(new Set(drawings).size).toBe(PICTURES.length);
  });
});

describe("rasterize", () => {
  it("paints the last shape over the first and cuts holes with no colour", () => {
    const rows = rasterize({
      id: "test",
      shapes: [rect(0, 0, 4, 1, "r"), rect(2, 0, 2, 1, "k"), rect(3, 0, 1, 1, ".")],
    });
    expect(rows[0].slice(0, 5)).toBe("rrk..");
  });

  it("traces an outline around the outside of a shape", () => {
    const rows = rasterize({ id: "test", shapes: [rect(2, 2, 2, 2, "y", "k")] });
    expect(rows.slice(1, 5).map((row) => row.slice(1, 5))).toEqual([
      ".kk.",
      "kyyk",
      "kyyk",
      ".kk.",
    ]);
  });
});

describe("runsOf", () => {
  it("joins neighbouring pixels of a colour into one run and skips the unpainted ones", () => {
    const picture = { id: "test", shapes: [rect(1, 0, 3, 1, "r"), rect(3, 0, 1, 1, "k")] };
    expect(runsOf(picture)).toEqual([
      { x: 1, y: 0, width: 2, fill: PALETTE.r },
      { x: 3, y: 0, width: 1, fill: PALETTE.k },
    ]);
  });
});
