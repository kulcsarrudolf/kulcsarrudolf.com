import { describe, expect, it } from "vitest";

import {
  emptyScores,
  insertScore,
  MAX_SCORES,
  parseScores,
  placeOf,
  qualifies,
  type Score,
} from "./highScores";

const score = (name: string, seconds: number, pairs: number): Score => ({ name, seconds, pairs });

const full = [
  score("a", 20, 10),
  score("b", 30, 12),
  score("c", 40, 14),
  score("d", 50, 16),
  score("e", 60, 18),
];

describe("parseScores", () => {
  it("reads nothing as empty lists", () => {
    expect(parseScores(null)).toEqual(emptyScores());
    expect(parseScores("not json")).toEqual(emptyScores());
    expect(parseScores("[1,2]")).toEqual(emptyScores());
  });

  it("keeps the well-formed scores, sorted and cut to the five best", () => {
    const stored = {
      beginner: [score("slow", 90, 9), { name: 1 }, score("fast", 10, 9), score("tie", 10, 8)],
      expert: [...full, score("f", 70, 20)],
      intermediate: "nope",
    };
    const parsed = parseScores(JSON.stringify(stored));
    expect(parsed.beginner.map(({ name }) => name)).toEqual(["tie", "fast", "slow"]);
    expect(parsed.expert).toHaveLength(MAX_SCORES);
    expect(parsed.intermediate).toEqual([]);
  });
});

describe("qualifies", () => {
  it("lets anything onto a list with room", () => {
    expect(qualifies([], { seconds: 999, pairs: 99 })).toBe(true);
  });

  it("needs to beat the last place on a full list, not tie it", () => {
    expect(qualifies(full, { seconds: 59, pairs: 30 })).toBe(true);
    expect(qualifies(full, { seconds: 60, pairs: 17 })).toBe(true);
    expect(qualifies(full, { seconds: 60, pairs: 18 })).toBe(false);
  });
});

describe("insertScore", () => {
  it("puts the score in its place and drops what falls off the end", () => {
    const list = insertScore(full, score("  new  ", 25, 11));
    expect(list.map(({ name }) => name)).toEqual(["a", "new", "b", "c", "d"]);
  });

  it("ranks a tie after the score that was there first", () => {
    const list = insertScore([score("first", 20, 10)], score("second", 20, 10));
    expect(list.map(({ name }) => name)).toEqual(["first", "second"]);
  });
});

describe("placeOf", () => {
  it("counts the scores that beat it", () => {
    expect(placeOf(full, { seconds: 10, pairs: 99 })).toBe(0);
    expect(placeOf(full, { seconds: 30, pairs: 12 })).toBe(2);
    expect(placeOf(full, { seconds: 99, pairs: 1 })).toBe(5);
  });
});
