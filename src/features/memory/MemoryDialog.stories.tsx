import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import MemoryDialog from "./MemoryDialog";
import { BEVEL_BUTTON, SYSTEM_TEXT } from "./win";

const meta = {
  title: "Memory/MemoryDialog",
  component: MemoryDialog,
  args: {
    title: "How to Play",
    onDismiss: fn(),
    children: (
      <p className="font-normal">Flip any two blocks. If the pictures match, both disappear.</p>
    ),
    actions: (
      <button type="button" className={`${BEVEL_BUTTON} min-w-20 px-4 py-1`}>
        OK
      </button>
    ),
  },
  parameters: {
    docs: {
      description: {
        component:
          "A Windows 3.1 message box over the board, inside the game's window. Its first button takes the caret, and Escape answers it.",
      },
    },
  },
  render: (args) => (
    <div className={`relative h-72 w-[28rem] border-2 border-black bg-win-aqua ${SYSTEM_TEXT}`}>
      <MemoryDialog {...args} />
    </div>
  ),
} satisfies Meta<typeof MemoryDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
