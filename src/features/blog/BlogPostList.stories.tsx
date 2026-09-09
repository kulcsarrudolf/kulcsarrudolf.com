import type { Meta, StoryObj } from "@storybook/react-vite";

import { posts } from "@/test/fixtures";

import BlogPostList from "./BlogPostList";

const meta = {
  title: "Blog/BlogPostList",
  component: BlogPostList,
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
} satisfies Meta<typeof BlogPostList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Compact: Story = {
  args: { title: "Recent posts", compact: true, noOfElements: 3 },
};

export const Empty: Story = {
  args: { posts: [] },
};
