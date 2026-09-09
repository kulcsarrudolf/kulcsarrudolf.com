import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import SudokuNumberPad from "./SudokuNumberPad";

const counts = (...placed: number[]) => new Map(placed.map((n, i) => [i, n]));

const meta = {
  title: "Sudoku/SudokuNumberPad",
  component: SudokuNumberPad,
  args: {
    numberCounts: counts(0, 0, 0, 0, 0, 0, 0, 0, 0),
    hasSelection: true,
    onEnter: fn(),
    onClear: fn(),
    clearLabel: "Clear",
  },
  parameters: {
    docs: {
      description: {
        component:
          "The keys under the board. Nothing can be entered until a cell is picked, so the pad greys out, and a number retires once all nine of it are on the board rather than letting the player spend a mistake on it.",
      },
    },
  },
  globals: { backgrounds: { value: "white" } },
} satisfies Meta<typeof SudokuNumberPad>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NoCellSelected: Story = {
  args: { hasSelection: false },
};

export const SomeNumbersSpent: Story = {
  args: { numberCounts: counts(9, 4, 9, 0, 2, 9, 1, 0, 3) },
};
