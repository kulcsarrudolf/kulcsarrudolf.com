import type { Meta, StoryObj } from "@storybook/react-vite";

import ThemeToggle from "./ThemeToggle";

const meta = {
  title: "Layout/Navbar/ThemeToggle",
  component: ThemeToggle,
  parameters: {
    docs: {
      description: {
        component:
          "The light switch. The bulb is lit while the page is light and goes out when it is dark; pressing it flips the `dark` class on `<html>` and remembers the choice. Every visit opens light: the OS setting is never consulted. Press it here and the whole story canvas follows, since the class lands on this document.",
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
} satisfies Meta<typeof ThemeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OnBrand: Story = {
  args: { tone: "onBrand" },
  globals: { backgrounds: { value: "navbar" } },
};

export const OnSurface: Story = {
  args: { tone: "onSurface" },
  globals: { backgrounds: { value: "white" } },
  parameters: {
    docs: {
      description: {
        story:
          "Inside the menu sheet, beside the close button, where the bar's white would vanish.",
      },
    },
  },
};
