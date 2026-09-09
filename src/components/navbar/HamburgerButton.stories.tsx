import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import HamburgerButton from "./HamburgerButton";

const meta = {
  title: "Navbar/HamburgerButton",
  component: HamburgerButton,
  args: {
    onClick: fn(),
  },
  parameters: {
    docs: {
      description: {
        component: "Only visible below the `md` breakpoint (it carries `md:hidden`), so the story uses a phone viewport.",
      },
    },
  },
  globals: {
    backgrounds: { value: "navbar" },
    viewport: { value: "mobile1", isRotated: false },
  },
  decorators: [
    (Story) => (
      <div className="p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof HamburgerButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
