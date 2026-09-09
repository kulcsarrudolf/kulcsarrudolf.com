import type { Meta, StoryObj } from "@storybook/react-vite";

import Subtitle from "./Subtitle";

const meta = {
  title: "UI/Typography/Subtitle",
  component: Subtitle,
  args: {
    children: "Current focus",
  },
  argTypes: {
    children: { control: "text" },
  },
} satisfies Meta<typeof Subtitle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
