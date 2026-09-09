import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import NavSheet from "./NavSheet";

const meta = {
  title: "Navbar/NavSheet",
  component: NavSheet,
  args: {
    id: "primary-navigation",
    onClose: fn(),
  },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "The mobile menu, using the same full-bleed white panel over a `bg-black/50` backdrop as WelcomeModal and SudokuModal. Escape closes it, tab is trapped inside it, and the page behind it cannot scroll.",
      },
    },
  },
  globals: { viewport: { value: "mobile1", isRotated: false } },
} satisfies Meta<typeof NavSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
