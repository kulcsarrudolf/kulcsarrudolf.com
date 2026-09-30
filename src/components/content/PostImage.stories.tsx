import type { Meta, StoryObj } from "@storybook/react-vite";

import PostImage from "./PostImage";

const meta = {
  title: "Content/PostImage",
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

export const Diagram: Story = {
  args: {
    variant: "diagram",
    src: "https://res.cloudinary.com/dialh0kqy/image/upload/q_auto/f_auto/v1790791198/diamond-system-diagram.png",
    alt: "A system diagram",
    title: "The viewer shows this as its caption",
  },
};
