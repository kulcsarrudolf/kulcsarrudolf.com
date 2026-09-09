import type { Meta, StoryObj } from "@storybook/react-vite";

import PageShell from "./PageShell";
import { Paragraph, Title } from "@/components/ui/typography";

const meta = {
  title: "Layout/PageShell",
  component: PageShell,
  // The navbar is fixed, and the room it needs is set on <body> by
  // RootDocument, which Storybook does not render. The decorator stands in for
  // it so the card is not hidden underneath the bar.
  decorators: [
    (Story) => (
      <div className="mt-20 sm:mt-28">
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "The centred column every page sits in: the navbar, then the page's content in a bordered card. Its sibling `RootDocument` holds the `<html>` and `<body>` around it, which is why that one has no story of its own.",
      },
    },
  },
  args: {
    children: (
      <>
        <Title>A page</Title>
        <Paragraph>Whatever the route renders lands here, inside the card.</Paragraph>
      </>
    ),
  },
} satisfies Meta<typeof PageShell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
