import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import MemoryTitleBar from "./MemoryTitleBar";
import { SYSTEM_TEXT } from "./win";

const meta = {
  title: "Memory/MemoryTitleBar",
  component: MemoryTitleBar,
  args: { title: "Memory Blocks", onClose: fn(), closeLabel: "Close Memory Blocks" },
  parameters: {
    docs: {
      description: {
        component:
          "A Windows 3.1 title bar. The control-menu box at the left closes the window; the arrows at the right are there to be recognised.",
      },
    },
  },
  render: (args) => (
    <div className={`w-96 border-2 border-black ${SYSTEM_TEXT}`}>
      <MemoryTitleBar {...args} />
    </div>
  ),
} satisfies Meta<typeof MemoryTitleBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Window: Story = {};

export const Dialog: Story = {
  args: { title: "About Memory Blocks", onClose: undefined, dialog: true },
};
