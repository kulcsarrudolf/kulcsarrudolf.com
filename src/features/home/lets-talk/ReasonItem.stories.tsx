import type { Meta, StoryObj } from "@storybook/react-vite";

import { GrowthIcon, IdeaIcon } from "./icons";
import ReasonItem from "./ReasonItem";

const meta = {
  title: "Home/Let's talk/ReasonItem",
  component: ReasonItem,
  args: {
    icon: <IdeaIcon />,
    label: "A new idea",
    children:
      "You have an idea and need someone to turn it into a product people can actually use.",
  },
  parameters: {
    docs: {
      description: {
        component:
          "One case inside the Let's Talk band: an icon, a short label, and the sentence. It only ever sits on brand blue, so every story here is drawn on that background.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="rounded-xl bg-brand p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ReasonItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Pair: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Two of them in the band's grid, where the hairline above each one turns the six cases into a ruled matrix.",
      },
    },
  },
  render: (args) => (
    <div className="grid gap-x-8 sm:grid-cols-2">
      <ReasonItem {...args} />
      <ReasonItem icon={<GrowthIcon />} label="Growth hurts">
        You already have software, and adding features or handling growth has turned slow and
        painful.
      </ReasonItem>
    </div>
  ),
};

export const Narrow: Story = {
  parameters: {
    docs: {
      description: {
        story: "At a phone width, where the sentence wraps to several lines under its label.",
      },
    },
  },
  render: (args) => (
    <div style={{ maxWidth: 294 }}>
      <ReasonItem {...args} />
    </div>
  ),
};
