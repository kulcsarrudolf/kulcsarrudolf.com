import type { Meta, StoryObj } from "@storybook/react-vite";

import LetsTalk from "./LetsTalk";

const meta = {
  title: "General/LetsTalk",
  component: LetsTalk,
  parameters: {
    docs: {
      description: {
        component:
          "Reasons to get in touch, written as endings to the heading's sentence. Four cases with an icon, then the easter egg set apart under a dashed rule, then two actions: the contact form and the calendar booking page. The copy comes from the translation files, so use the language toolbar to see the Hungarian version.",
      },
    },
  },
} satisfies Meta<typeof LetsTalk>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Narrow: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Constrained to a phone-sized width, where the rows wrap to several lines and the two buttons stack full width.",
      },
    },
  },
  render: () => (
    <div style={{ maxWidth: 342 }}>
      <LetsTalk />
    </div>
  ),
};
