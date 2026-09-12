import type { Meta, StoryObj } from "@storybook/react-vite";

import TerminalDock from "./TerminalDock";

const meta = {
  title: "Home/Terminal intro/TerminalDock",
  component: TerminalDock,
  parameters: {
    docs: {
      description: {
        component:
          "The button in the bottom right corner of the page, which is all that is left of the terminal once its red button has been pressed. Pressing it puts the window back where it was, history and all. It is fixed to the corner of the viewport, so in the docs it sits in the corner of the page rather than of this block.",
      },
    },
  },
  args: {
    onOpen: () => {},
    label: "Open the terminal",
  },
} satisfies Meta<typeof TerminalDock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
