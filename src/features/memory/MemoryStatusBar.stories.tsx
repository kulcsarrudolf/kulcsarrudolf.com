import type { Meta, StoryObj } from "@storybook/react-vite";

import MemoryStatusBar from "./MemoryStatusBar";
import { SYSTEM_TEXT } from "./win";

const meta = {
  title: "Memory/MemoryStatusBar",
  component: MemoryStatusBar,
  args: { seconds: 108, pairs: 36 },
  parameters: {
    docs: {
      description: {
        component:
          "The line under the board: the seconds since the first flip and the pairs turned over.",
      },
    },
  },
  render: (args) => (
    <div className={`w-96 border-2 border-black ${SYSTEM_TEXT}`}>
      <MemoryStatusBar {...args} />
    </div>
  ),
} satisfies Meta<typeof MemoryStatusBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playing: Story = {};

export const NotStarted: Story = {
  args: { seconds: 0, pairs: 0 },
};
