import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { makePuzzle, solvePuzzle } from "@/lib/sudoku";

import SudokuBoard from "./SudokuBoard";
import type { CellHighlighting } from "./useSudokuGame";

// One puzzle, generated when the story file loads, so every story below shows
// the same board.
const puzzle = makePuzzle();
const solution = solvePuzzle(puzzle) ?? puzzle;
const originalCells = new Set(
  puzzle.flatMap((value, index) => (value === null ? [] : [index])),
);

// The game decides the highlighting; the stories just stand in for it.
const highlight =
  (matches: (index: number) => boolean) =>
  (index: number): CellHighlighting => ({
    isHighlighted: matches(index),
    isSameNumber: false,
  });

const meta = {
  title: "Sudoku/SudokuBoard",
  component: SudokuBoard,
  args: {
    board: puzzle,
    originalCells,
    selectedCell: 40,
    shakingCell: null,
    isRevealed: false,
    highlightingFor: highlight(() => false),
    onSelect: fn(),
  },
  parameters: {
    docs: {
      description: {
        component:
          "The 9x9 grid. It only draws: which cells are highlighted, shaking or revealed is decided by `useSudokuGame` and handed down. Thicker rules after the third and sixth cell mark out the 3x3 boxes.",
      },
    },
  },
  globals: { backgrounds: { value: "white" } },
} satisfies Meta<typeof SudokuBoard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithHighlighting: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The row, column and box of the selected cell are tinted, which is how the game shows where a number cannot go.",
      },
    },
  },
  args: {
    highlightingFor: highlight(
      (index) =>
        Math.floor(index / 9) === 4 ||
        index % 9 === 4 ||
        (Math.floor(index / 27) === 1 && Math.floor((index % 9) / 3) === 1),
    ),
  },
};

export const Revealed: Story = {
  parameters: {
    docs: {
      description: {
        story: "Five mistakes and the solution is filled in, in green.",
      },
    },
  },
  args: { board: solution, selectedCell: null, isRevealed: true },
};
