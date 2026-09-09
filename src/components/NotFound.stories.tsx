import type { Meta, StoryObj } from "@storybook/react-vite";

import { posts } from "@/stories/fixtures";

import NotFound from "./NotFound";

const meta = {
  title: "Pages/NotFound",
  component: NotFound,
  args: {
    recentPosts: posts.slice(0, 3),
  },
} satisfies Meta<typeof NotFound>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithRecentPosts: Story = {};

export const WithoutPosts: Story = {
  args: { recentPosts: [] },
};
