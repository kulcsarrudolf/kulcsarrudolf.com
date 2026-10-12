import { describe, expect, it } from "vitest";

import { PAIRS } from "./engine";
import { PALETTE, PICTURE_HEIGHT, PICTURE_WIDTH, pixels, runsOf } from "./picture";
import { PICTURES } from "./pictures";

describe("PICTURES", () => {
  it("has a picture for every pair of the largest board, each under its own name", () => {
    expect(PICTURES.length).toBeGreaterThanOrEqual(Math.max(...Object.values(PAIRS)));
    expect(new Set(PICTURES.map(({ id }) => id)).size).toBe(PICTURES.length);
  });

  it.each(PICTURES.map((picture) => [picture.id, picture] as const))(
    "writes %s as a full grid in the palette",
    (_, { rows }) => {
      expect(rows).toHaveLength(PICTURE_HEIGHT);
      for (const row of rows) {
        expect(row).toHaveLength(PICTURE_WIDTH);
        for (const letter of row) expect(letter === "." || letter in PALETTE).toBe(true);
      }
      expect(rows.join("").replace(/\./g, "").length).toBeGreaterThan(PICTURE_WIDTH * 4);
    },
  );

  it("never draws two pictures the same", () => {
    const drawings = PICTURES.map(({ rows }) => rows.join(""));
    expect(new Set(drawings).size).toBe(PICTURES.length);
  });
});

describe("pixels", () => {
  it("reads one row per line and ignores the indentation and the blank lines around them", () => {
    expect(pixels`
      .rr.
      kyyk
    `).toEqual([".rr.", "kyyk"]);
  });
});

describe("runsOf", () => {
  it("joins neighbouring pixels of a colour into one run and skips the unpainted ones", () => {
    const picture = { id: "test", rows: [".rrk."] };
    expect(runsOf(picture)).toEqual([
      { x: 1, y: 0, width: 2, fill: PALETTE.r },
      { x: 3, y: 0, width: 1, fill: PALETTE.k },
    ]);
  });
});
