import type { Meta, StoryObj } from "@storybook/react-vite";

import Brand from "./Brand";

const meta = {
  title: "Layout/Navbar/Brand",
  component: Brand,
  parameters: {
    docs: {
      description: {
        component:
          "A real link rather than a div with an onClick, so it is keyboard reachable, cmd-clickable, and keeps the visitor's `?lang`. Hold the portrait for a few seconds.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Brand>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OnBrand: Story = {
  args: { tone: "onBrand" },
  globals: { backgrounds: { value: "navbar" } },
};

export const OnSurface: Story = {
  args: { tone: "onSurface" },
  globals: { backgrounds: { value: "white" } },
};
