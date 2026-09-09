import type { Meta, StoryObj } from "@storybook/react-vite";

import { posts } from "@/stories/fixtures";

import BlogPostListClient from "./BlogPostListClient";

const meta = {
  title: "Blog/BlogPostListClient",
  component: BlogPostListClient,
  args: {
    title: "Latest posts",
    posts,
    noOfElements: 0,
    compact: false,
  },
  argTypes: {
    noOfElements: {
      control: { type: "number", min: 0, max: posts.length },
      description: "0 shows every post.",
    },
  },
} satisfies Meta<typeof BlogPostListClient>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Compact: Story = {
  args: { title: "Recent posts", compact: true, noOfElements: 3 },
};

export const Empty: Story = {
  args: { posts: [] },
};
