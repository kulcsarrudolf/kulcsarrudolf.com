import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import Sudoku from "./Sudoku";

const meta = {
  title: "Sudoku/Sudoku",
  component: Sudoku,
  args: {
    onClose: fn(),
  },
  parameters: {
    docs: {
      description: {
        component:
          "The playable game: select a cell, then a number. Five mistakes end the game. A fresh puzzle is generated every time the story mounts.",
      },
    },
  },
  globals: { backgrounds: { value: "white" } },
} satisfies Meta<typeof Sudoku>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
