import type { Meta, StoryObj } from "@storybook/react-vite";

import { posts } from "@/stories/fixtures";

import RelatedPosts from "./RelatedPosts";

const meta = {
  title: "Projects/RelatedPosts",
  component: RelatedPosts,
  args: {
    posts: posts.slice(0, 2),
  },
} satisfies Meta<typeof RelatedPosts>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LongTitles: Story = {
  args: {
    posts: [
      {
        ...posts[0],
        title:
          "A very long post title that wraps onto a second line on narrow screens so the arrow has to stay aligned with the first line",
      },
      posts[1],
    ],
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 320 }}>
        <Story />
      </div>
    ),
  ],
};

export const Empty: Story = {
  args: { posts: [] },
};
