import { describe, expect, it } from "vitest";

import { type Board, deal, flip, isCleared, isMatch, PAIRS, settle, SKILLS } from "./engine";

/** A small board with the pictures in a known order: 0 0 1 1. */
const board = (): Board => ({
  skill: "beginner",
  blocks: [0, 0, 1, 1].map((picture) => ({ picture, state: "down" as const })),
  open: [],
  pairsFlipped: 0,
});

describe("deal", () => {
  it.each(SKILLS)("deals every picture of a %s board exactly twice, face down", (skill) => {
    const { blocks, open, pairsFlipped } = deal(skill);
    expect(blocks).toHaveLength(PAIRS[skill] * 2);
    expect(blocks.every((block) => block.state === "down")).toBe(true);
    const counts = new Map<number, number>();
    for (const { picture } of blocks) counts.set(picture, (counts.get(picture) ?? 0) + 1);
    expect(counts.size).toBe(PAIRS[skill]);
    expect([...counts.values()].every((count) => count === 2)).toBe(true);
    expect(open).toEqual([]);
    expect(pairsFlipped).toBe(0);
  });
});

describe("flip", () => {
  it("turns one block up and counts nothing until the second", () => {
    const once = flip(board(), 1);
    expect(once.blocks[1].state).toBe("up");
    expect(once.open).toEqual([1]);
    expect(once.pairsFlipped).toBe(0);

    const twice = flip(once, 2);
    expect(twice.open).toEqual([1, 2]);
    expect(twice.pairsFlipped).toBe(1);
  });

  it("leaves a block that is already up or gone alone", () => {
    const once = flip(board(), 0);
    expect(flip(once, 0)).toBe(once);

    const gone = settle(flip(once, 1));
    expect(flip(gone, 0)).toBe(gone);
  });

  it("settles the last pair before turning a third block", () => {
    const miss = flip(flip(board(), 0), 2);
    const third = flip(miss, 3);
    expect(third.blocks.map((block) => block.state)).toEqual(["down", "down", "down", "up"]);
    expect(third.open).toEqual([3]);
    expect(third.pairsFlipped).toBe(1);
  });
});

describe("settle", () => {
  it("takes a matching pair away", () => {
    const pair = flip(flip(board(), 0), 1);
    expect(isMatch(pair)).toBe(true);
    expect(settle(pair).blocks.map((block) => block.state)).toEqual([
      "gone",
      "gone",
      "down",
      "down",
    ]);
  });

  it("turns a pair that does not match back down", () => {
    const pair = flip(flip(board(), 1), 2);
    expect(isMatch(pair)).toBe(false);
    const settled = settle(pair);
    expect(settled.blocks.every((block) => block.state === "down")).toBe(true);
    expect(settled.open).toEqual([]);
  });

  it("does nothing with fewer than two blocks open", () => {
    const once = flip(board(), 0);
    expect(settle(once)).toBe(once);
  });
});

describe("isCleared", () => {
  it("is true once every pair has gone", () => {
    let current = board();
    for (const index of [0, 1, 2, 3]) current = flip(current, index);
    expect(isCleared(current)).toBe(false);
    expect(isCleared(settle(current))).toBe(true);
    expect(settle(current).pairsFlipped).toBe(2);
  });
});
