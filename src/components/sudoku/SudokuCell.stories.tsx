import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import SudokuCell from "./SudokuCell";

const meta = {
  title: "Sudoku/SudokuCell",
  component: SudokuCell,
  args: {
    value: 4,
    isOriginal: false,
    isSelected: false,
    isHighlighted: false,
    isSameNumber: false,
    isShaking: false,
    isRevealed: false,
    onClick: fn(),
  },
  argTypes: {
    value: {
      control: { type: "number", min: 0, max: 8 },
      description: "Zero-based; the cell displays `value + 1`. `null` is an empty cell.",
    },
  },
  globals: { backgrounds: { value: "white" } },
} satisfies Meta<typeof SudokuCell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const UserValue: Story = {};

export const Empty: Story = { args: { value: null } };

export const Original: Story = { args: { isOriginal: true } };

export const Selected: Story = { args: { isSelected: true } };

export const Highlighted: Story = { args: { isHighlighted: true } };

export const SameNumber: Story = { args: { isSameNumber: true } };

export const Revealed: Story = { args: { isRevealed: true } };

export const Shaking: Story = {
  parameters: {
    docs: {
      description: {
        story: "The shake animation runs once on mount; reload the story to replay it.",
      },
    },
  },
  args: { isShaking: true },
};
