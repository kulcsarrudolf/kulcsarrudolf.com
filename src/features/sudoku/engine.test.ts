import { describe, expect, it } from "vitest";

import { type Board, makePuzzle, solvePuzzle } from "./engine";

const DIGITS = new Set([0, 1, 2, 3, 4, 5, 6, 7, 8]);

const groups = (board: Board): number[][] => {
  const rows = Array.from({ length: 9 }, (_, r) => board.slice(r * 9, r * 9 + 9));
  const cols = Array.from({ length: 9 }, (_, c) => rows.map((row) => row[c]));
  const boxes = Array.from({ length: 9 }, (_, b) =>
    Array.from(
      { length: 9 },
      (_, i) => board[(Math.floor(b / 3) * 3 + Math.floor(i / 3)) * 9 + (b % 3) * 3 + (i % 3)],
    ),
  );
  return [...rows, ...cols, ...boxes].map((group) => group.map((cell) => cell as number));
};

const isSolved = (board: Board): boolean =>
  board.length === 81 &&
  board.every((cell) => cell !== null) &&
  groups(board).every((group) => new Set(group).size === 9 && group.every((n) => DIGITS.has(n)));

describe("makePuzzle", () => {
  it("returns a partially filled 9x9 board", () => {
    const puzzle = makePuzzle();
    const givens = puzzle.filter((cell) => cell !== null);

    expect(puzzle).toHaveLength(81);
    expect(givens.length).toBeGreaterThan(16);
    expect(givens.length).toBeLessThan(81);
    expect(givens.every((n) => DIGITS.has(n as number))).toBe(true);
  });
});

describe("solvePuzzle", () => {
  it("solves a generated puzzle without changing its givens", () => {
    const puzzle = makePuzzle();
    const solution = solvePuzzle(puzzle);

    expect(solution).not.toBeNull();
    expect(isSolved(solution!)).toBe(true);
    puzzle.forEach((cell, i) => {
      if (cell !== null) {
        expect(solution![i]).toBe(cell);
      }
    });
  });

  it("fills an empty board", () => {
    expect(isSolved(solvePuzzle(Array(81).fill(null))!)).toBe(true);
  });

  it("returns null for a contradiction", () => {
    const board: Board = Array(81).fill(null);
    board[0] = 0;
    board[1] = 0;

    expect(solvePuzzle(board)).toBeNull();
  });
});
