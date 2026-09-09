import type { Meta, StoryObj } from "@storybook/react-vite";

import Divider from "./Divider";
import { Paragraph } from "@/components/general/typography";

const meta = {
  title: "General/Divider",
  component: Divider,
  parameters: {
    docs: {
      description: {
        component:
          "A rule between sections. Give it a label and the rule breaks either side of the word instead of running behind it.",
      },
    },
  },
  render: (args) => (
    <>
      <Paragraph>The section above the rule.</Paragraph>
      <Divider {...args} />
      <Paragraph>The section below it.</Paragraph>
    </>
  ),
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Plain: Story = {};

export const Labelled: Story = {
  args: { label: "or" },
};
