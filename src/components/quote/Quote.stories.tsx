import type { Meta, StoryObj } from "@storybook/react-vite";

import { quote } from "@/stories/fixtures";

import Quote from "./Quote";

const meta = {
  title: "Quote/Quote",
  component: Quote,
  args: {
    quote,
    clickable: true,
    className: "",
  },
} satisfies Meta<typeof Quote>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NotClickable: Story = {
  args: { clickable: false },
};

export const Random: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Without a `quote` prop the component picks a random quote on mount and only renders on the home page (`/`), which is where the story router starts.",
      },
    },
  },
  args: { quote: undefined },
};
