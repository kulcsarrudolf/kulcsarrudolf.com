import type { Meta, StoryObj } from "@storybook/react-vite";

import ArrowLink from "./ArrowLink";

const meta = {
  title: "General/ArrowLink",
  component: ArrowLink,
  args: {
    to: "/blog",
    direction: "forward",
    children: "Migrating from Next.js to TanStack Start",
  },
  argTypes: {
    direction: { control: "inline-radio", options: ["forward", "back"] },
  },
  parameters: {
    docs: {
      description: {
        component:
          "A router link led by a small arrow. Used for the related-posts list under a project and for the link back to the project index. The negative margin puts the arrow on the body text's left edge while the padded hit area stays large.",
      },
    },
  },
} satisfies Meta<typeof ArrowLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Forward: Story = {};

export const Back: Story = {
  args: { direction: "back", children: "Back to all projects" },
};
