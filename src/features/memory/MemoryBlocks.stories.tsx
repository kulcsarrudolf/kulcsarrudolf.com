import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import MemoryBlocks from "./MemoryBlocks";

const meta = {
  title: "Memory/MemoryBlocks",
  component: MemoryBlocks,
  args: { onClose: fn() },
  parameters: {
    docs: {
      description: {
        component:
          "The whole game in its Windows 3.1 window, without the dialog around it: the menus, the board, the time and the pairs. It keeps its 1991 colours in both themes.",
      },
    },
  },
} satisfies Meta<typeof MemoryBlocks>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Intermediate: Story = {};

export const Beginner: Story = {
  args: { initialSkill: "beginner" },
};

export const Expert: Story = {
  args: { initialSkill: "expert" },
};
