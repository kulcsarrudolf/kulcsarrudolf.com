import type { Meta, StoryObj } from "@storybook/react-vite";

import { markdown } from "@/test/fixtures";

import MarkdownBody from "./MarkdownBody";

const meta = {
  title: "Content/MarkdownBody",
  component: MarkdownBody,
  args: {
    content: markdown,
  },
  parameters: {
    docs: {
      description: {
        component:
          "Renders a post or project body. Internal links stay in the tab, external ones open a new one, and the custom `<PostImage>` tag becomes a click-to-zoom image.",
      },
    },
  },
  decorators: [
    (Story) => (
      // Same wrapper the post and project routes use.
      <div className="prose prose-sans container mx-auto max-w-none">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MarkdownBody>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Minimal: Story = {
  args: { content: "Just one **paragraph** of markdown." },
};
