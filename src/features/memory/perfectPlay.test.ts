import { describe, expect, it } from "vitest";

import { type Board, deal, PAIRS, SKILLS } from "./engine";
import { boardAt, planPerfectRun, seenAt, STEPS_PER_TURN } from "./perfectPlay";

const kinds = (pictures: number[]) => planPerfectRun(pictures).map(({ kind }) => kind);

describe("planPerfectRun", () => {
  it("takes a pair at once when the two new blocks match", () => {
    expect(kinds([0, 0, 1, 1])).toEqual(["lucky", "lucky"]);
  });

  it("remembers two new pictures and comes back for each partner", () => {
    expect(planPerfectRun([0, 1, 0, 1])).toEqual([
      { first: 0, second: 1, kind: "new" },
      { first: 2, second: 0, kind: "known" },
      { first: 3, second: 1, kind: "known" },
    ]);
  });

  it("turns a miss that finds an earlier partner into a sure pair next", () => {
    expect(planPerfectRun([0, 1, 2, 1, 2, 0])).toEqual([
      { first: 0, second: 1, kind: "new" },
      { first: 2, second: 3, kind: "reveal" },
      { first: 1, second: 3, kind: "pair" },
      { first: 4, second: 2, kind: "known" },
      { first: 5, second: 0, kind: "known" },
    ]);
  });

  it.each(SKILLS)(
    "clears a %s board, each block once, in at least as many turns as pairs",
    (skill) => {
      const pictures = deal(skill).blocks.map(({ picture }) => picture);
      const turns = planPerfectRun(pictures);
      const matched = turns.filter(({ first, second }) => pictures[first] === pictures[second]);
      const gone = matched.flatMap(({ first, second }) => [first, second]).sort((a, b) => a - b);

      expect(gone).toEqual(pictures.map((_, index) => index));
      expect(turns.length).toBeGreaterThanOrEqual(PAIRS[skill]);
      expect(turns.length).toBeLessThan(PAIRS[skill] * 2);
    },
  );
});

describe("boardAt", () => {
  const start = (): Board => ({
    skill: "beginner",
    blocks: [0, 1, 0, 1].map((picture) => ({ picture, state: "down" as const })),
    open: [],
    pairsFlipped: 0,
  });
  const turns = planPerfectRun([0, 1, 0, 1]);
  const states = (step: number) => boardAt(start(), turns, step).blocks.map(({ state }) => state);

  it("plays each turn as two flips and a settle", () => {
    expect(states(0)).toEqual(["down", "down", "down", "down"]);
    expect(states(1)).toEqual(["up", "down", "down", "down"]);
    expect(states(2)).toEqual(["up", "up", "down", "down"]);
    expect(states(3)).toEqual(["down", "down", "down", "down"]);
    expect(states(5)).toEqual(["up", "down", "up", "down"]);
    expect(states(6)).toEqual(["gone", "down", "gone", "down"]);
  });

  it("ends with the board cleared and every turn counted", () => {
    const end = boardAt(start(), turns, turns.length * STEPS_PER_TURN + 5);
    expect(end.blocks.every(({ state }) => state === "gone")).toBe(true);
    expect(end.pairsFlipped).toBe(turns.length);
  });
});

describe("seenAt", () => {
  it("adds each block as it is flipped", () => {
    const turns = planPerfectRun([0, 1, 0, 1]);
    expect([...seenAt(turns, 0)]).toEqual([]);
    expect([...seenAt(turns, 1)]).toEqual([0]);
    expect([...seenAt(turns, 2)]).toEqual([0, 1]);
    expect([...seenAt(turns, 4)]).toEqual([0, 1, 2]);
  });
});
