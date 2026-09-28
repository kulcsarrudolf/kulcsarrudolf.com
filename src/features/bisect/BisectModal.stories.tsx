import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import BisectModal from "./BisectModal";

const meta = {
  title: "Bisect/BisectModal",
  component: BisectModal,
  args: { onClose: fn() },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Bisect over the page, the way `bisect` in the terminal opens it: the whole screen on a phone, a dark window from `md` up, dark in both themes like the terminal.",
      },
    },
  },
} satisfies Meta<typeof BisectModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
