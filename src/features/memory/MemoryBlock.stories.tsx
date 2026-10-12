import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import MemoryBlock from "./MemoryBlock";
import { PICTURES } from "./pictures";

const meta = {
  title: "Memory/MemoryBlock",
  component: MemoryBlock,
  args: {
    picture: PICTURES[0],
    state: "down",
    number: 1,
    tabbable: true,
    onFlip: fn(),
    onKeyDown: fn(),
    onFocus: fn(),
  },
  parameters: {
    docs: {
      description: {
        component:
          "One block of the board: the yellow block face down, the picture on white face up, and an empty square once its pair is found.",
      },
    },
  },
  render: (args) => (
    <div className="w-20 bg-win-aqua p-3">
      <MemoryBlock {...args} />
    </div>
  ),
} satisfies Meta<typeof MemoryBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FaceDown: Story = {};

export const FaceUp: Story = {
  args: { state: "up" },
};

export const Gone: Story = {
  args: { state: "gone" },
};
