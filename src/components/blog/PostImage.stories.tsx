import type { Meta, StoryObj } from "@storybook/react-vite";

import PostImage from "./PostImage";

const meta = {
  title: "Blog/PostImage",
  component: PostImage,
  args: {
    src: "/images/me-logo.png",
    alt: "Rudolf's avatar",
    title: "Click to open the photo viewer",
  },
  parameters: {
    docs: {
      description: {
        component:
          "An image from a blog post rendered with zimme-zoom. Click it to open the full-screen photo viewer.",
      },
    },
  },
} satisfies Meta<typeof PostImage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
