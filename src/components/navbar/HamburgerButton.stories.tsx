import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import HamburgerButton from "./HamburgerButton";

const meta = {
  title: "Navbar/HamburgerButton",
  component: HamburgerButton,
  args: {
    onClick: fn(),
    isOpen: false,
    controls: "primary-navigation",
    label: "Open main menu",
  },
  parameters: {
    docs: {
      description: {
        component:
          "Opens the mobile menu sheet. It retires at the `nav` breakpoint (706px), where the whole link list fits in the bar. `aria-expanded` tracks the sheet, so screen readers know whether the menu is open.",
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

export const Closed: Story = {};

export const Open: Story = {
  args: { isOpen: true, label: "Close menu" },
};
