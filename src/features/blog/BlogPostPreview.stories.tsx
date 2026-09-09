import type { Meta, StoryObj } from "@storybook/react-vite";

import { posts } from "@/test/fixtures";

import BlogPostPreview from "./BlogPostPreview";

const meta = {
  title: "Blog/BlogPostPreview",
  component: BlogPostPreview,
  args: {
    post: posts[0],
    compact: false,
  },
} satisfies Meta<typeof BlogPostPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Compact: Story = {
  args: { compact: true },
};

export const Hungarian: Story = {
  args: { post: posts[2] },
};
