import type { Meta, StoryObj } from "@storybook/react-vite";

import RailDots from "./RailDots";

const meta = {
  title: "Home/Current focus/RailDots",
  component: RailDots,
  args: {
    count: 4,
    range: { first: 0, last: 0 },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Progress dots under a card rail. Every card in view is a wide dot, so a phone showing one card gets one and a tablet showing three gets three. Decorative: the counter beside the heading says the same thing to a screen reader.",
      },
    },
  },
} satisfies Meta<typeof RailDots>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OneCardInView: Story = {};

export const ThreeCardsInView: Story = {
  args: { range: { first: 0, last: 2 } },
};

export const LastCard: Story = {
  args: { range: { first: 3, last: 3 } },
};
