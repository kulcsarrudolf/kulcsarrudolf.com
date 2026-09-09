import type { Meta, StoryObj } from "@storybook/react-vite";

import EndNote from "./EndNote";
import ArrowLink from "@/components/ui/ArrowLink";
import { Note, Paragraph } from "@/components/ui/typography";

const meta = {
  title: "UI/EndNote",
  component: EndNote,
  parameters: {
    docs: {
      description: {
        component:
          "The closing block under a page: room, a hairline rule, then a parting note or a link back. `centered` is for a note that reads as a footer; left-aligned suits a link that continues the page's reading line.",
      },
    },
  },
  render: (args) => (
    <>
      <Paragraph>The last of the page's content.</Paragraph>
      <EndNote {...args} />
    </>
  ),
  args: {
    children: <Note>Find the rest of my work on GitHub.</Note>,
  },
} satisfies Meta<typeof EndNote>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Centered: Story = {
  args: { centered: true },
};

export const WithBackLink: Story = {
  args: {
    children: (
      <ArrowLink to="/projects" direction="back">
        Back to all projects
      </ArrowLink>
    ),
  },
};
