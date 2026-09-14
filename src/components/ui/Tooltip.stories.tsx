import type { Meta, StoryObj } from "@storybook/react-vite";

import Tooltip from "./Tooltip";
import { Paragraph } from "@/components/ui/typography";

const meta = {
  title: "UI/Tooltip",
  component: Tooltip,
  parameters: {
    docs: {
      description: {
        component:
          "A short note above its trigger, shown on hover or keyboard focus. Tab to the trigger to see it without a mouse.",
      },
    },
  },
  args: {
    content: "A little more about this.",
    children: <Paragraph>Hover or focus this line.</Paragraph>,
  },
  decorators: [
    (Story) => (
      <div className="pt-16">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LongContent: Story = {
  args: {
    content:
      "A longer note wraps once it reaches its maximum width, rather than running across the page.",
  },
};
