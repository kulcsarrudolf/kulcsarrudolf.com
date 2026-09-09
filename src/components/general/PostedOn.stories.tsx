import type { Meta, StoryObj } from "@storybook/react-vite";

import PostedOn from "./PostedOn";

const meta = {
  title: "General/PostedOn",
  component: PostedOn,
  args: {
    date: "2026-09-05",
  },
} satisfies Meta<typeof PostedOn>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
