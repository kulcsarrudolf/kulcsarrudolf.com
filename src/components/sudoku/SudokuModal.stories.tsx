import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import SudokuModal from "./SudokuModal";

const meta = {
  title: "Sudoku/SudokuModal",
  component: SudokuModal,
  args: {
    onClose: fn(),
  },
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof SudokuModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
