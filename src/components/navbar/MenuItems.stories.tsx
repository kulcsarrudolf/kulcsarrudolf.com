import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import MenuItems from "./MenuItems";

const meta = {
  title: "Navbar/MenuItems",
  component: MenuItems,
  args: {
    onClick: fn(),
  },
  globals: { backgrounds: { value: "navbar" } },
  decorators: [
    (Story) => (
      <div className="p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MenuItems>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {};

export const Stacked: Story = {
  parameters: {
    docs: {
      description: {
        story: "Below the `md` breakpoint the items stack vertically inside the open hamburger menu.",
      },
    },
  },
  globals: { viewport: { value: "mobile1", isRotated: false } },
};
