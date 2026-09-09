import type { Meta, StoryObj } from "@storybook/react-vite";

import RailFade from "./RailFade";

const meta = {
  title: "General/RailFade",
  component: RailFade,
  args: { side: "right" },
  argTypes: {
    side: { control: "inline-radio", options: ["left", "right"] },
  },
  parameters: {
    docs: {
      description: {
        component:
          'The soft edge on a rail that has more cards beyond it, so a clipped card reads as "there is more" rather than as a cropping mistake. It dissolves into the page background, so the story sits on that colour rather than on white.',
      },
    },
  },
  render: (args) => (
    <div className="relative h-32 bg-surface">
      <div className="flex h-full items-center gap-4 overflow-hidden">
        <div className="h-24 w-40 shrink-0 rounded-lg border border-gray-200 bg-white shadow-sm" />
        <div className="h-24 w-40 shrink-0 rounded-lg border border-gray-200 bg-white shadow-sm" />
        <div className="h-24 w-40 shrink-0 rounded-lg border border-gray-200 bg-white shadow-sm" />
      </div>
      <RailFade {...args} />
    </div>
  ),
} satisfies Meta<typeof RailFade>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Right: Story = {};

export const Left: Story = { args: { side: "left" } };
