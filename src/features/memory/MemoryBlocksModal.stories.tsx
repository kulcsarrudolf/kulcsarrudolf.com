import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import MemoryBlocksModal from "./MemoryBlocksModal";

const meta = {
  title: "Memory/MemoryBlocksModal",
  component: MemoryBlocksModal,
  args: { onClose: fn() },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Memory Blocks over the page, the way `memory` in the terminal opens it: the whole screen on a phone, the Windows 3.1 window from `md` up.",
      },
    },
  },
} satisfies Meta<typeof MemoryBlocksModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
