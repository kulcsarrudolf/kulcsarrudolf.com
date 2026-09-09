import type { Meta, StoryObj } from "@storybook/react-vite";

import HighlightP from "./HighlightP";

const meta = {
  title: "UI/Typography/HighlightP",
  component: HighlightP,
  args: {
    children: "highlighted words",
  },
  argTypes: {
    children: { control: "text" },
  },
  render: (args) => (
    <p>
      An inline <HighlightP {...args} /> inside a sentence.
    </p>
  ),
} satisfies Meta<typeof HighlightP>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
