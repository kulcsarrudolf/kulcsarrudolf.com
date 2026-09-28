import { describe, expect, it } from "vitest";

import type { Cut, Verdict } from "./board";
import { shareText, shuffle, summarize } from "./score";

const result = (offBy: number, verdict: Verdict): Cut => ({
  line: { from: [0, 0], to: [0, 1] },
  parts: [
    { share: 0.5, centroid: null },
    { share: 0.5, centroid: null },
  ],
  tenths: [500 - offBy, 500 + offBy],
  offBy,
  verdict,
});

describe("shuffle", () => {
  it("returns every item exactly once, leaving the original alone", () => {
    const items = [1, 2, 3, 4, 5];
    const shuffled = shuffle(items, () => 0.3);
    expect([...shuffled].sort()).toEqual(items);
    expect(items).toEqual([1, 2, 3, 4, 5]);
  });

  it("follows the random source it is given", () => {
    expect(shuffle([1, 2, 3], () => 0)).toEqual([2, 3, 1]);
    expect(shuffle([1, 2, 3], () => 0.999)).toEqual([1, 2, 3]);
  });
});

describe("summarize", () => {
  it("counts wins with the perfect ones among them, and averages the misses", () => {
    const summary = summarize([result(2, "perfect"), result(15, "win"), result(88, "miss")]);
    expect(summary).toEqual({
      played: 3,
      wins: 2,
      perfect: 1,
      averageOffBy: 35,
      bestOffBy: 2,
    });
  });

  it("has nothing to average before the first cut", () => {
    expect(summarize([])).toMatchObject({ played: 0, averageOffBy: null, bestOffBy: null });
  });
});

describe("shareText", () => {
  it("prints the score, the tiles eight to a row, and where to play", () => {
    const scores = [
      ...Array.from({ length: 8 }, () => result(0, "perfect")),
      result(10, "win"),
      result(90, "miss"),
    ];
    expect(shareText(scores, 40)).toBe("bisect 9/40\n🟩🟩🟩🟩🟩🟩🟩🟩\n🟨⬛\nkulcsarrudolf.com");
  });
});
