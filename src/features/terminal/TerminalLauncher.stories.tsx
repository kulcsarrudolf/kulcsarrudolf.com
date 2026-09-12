import type { Meta, StoryObj } from "@storybook/react-vite";

import TerminalLauncher from "./TerminalLauncher";

const meta = {
  title: "Terminal/TerminalLauncher",
  component: TerminalLauncher,
  parameters: {
    docs: {
      description: {
        component:
          "What puts the terminal on every page but the home page: a button in the bottom right corner of the viewport and, behind it, the same window the home page opens with. It comes up over the page rather than in it, and closes itself when the visitor changes page. Rendered once in the root route's shell, so no page has to ask for it; on the home page it renders nothing, since the terminal is already on that page. In the docs the button sits in the corner of the page rather than of this block, because it is fixed to the viewport.",
      },
    },
  },
} satisfies Meta<typeof TerminalLauncher>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
