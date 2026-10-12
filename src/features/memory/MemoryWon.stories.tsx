import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import MemoryWon from "./MemoryWon";
import { SYSTEM_TEXT } from "./win";

const meta = {
  title: "Memory/MemoryWon",
  component: MemoryWon,
  args: {
    result: { skill: "intermediate", seconds: 108, pairs: 36 },
    record: false,
    defaultName: "",
    onDone: fn(),
  },
  parameters: {
    docs: {
      description: {
        component:
          "What a cleared board says: the time and the pairs, and a box for a name when the result makes the high score list.",
      },
    },
  },
  render: (args) => (
    <div className={`relative h-72 w-[28rem] border-2 border-black bg-win-aqua ${SYSTEM_TEXT}`}>
      <MemoryWon {...args} />
    </div>
  ),
} satisfies Meta<typeof MemoryWon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Cleared: Story = {};

export const HighScore: Story = {
  args: { record: true, defaultName: "Rudolf" },
};
