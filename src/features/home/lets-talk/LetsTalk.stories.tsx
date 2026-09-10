import type { Meta, StoryObj } from "@storybook/react-vite";

import LetsTalk from "./LetsTalk";

const meta = {
  title: "Home/Let's talk/LetsTalk",
  component: LetsTalk,
  parameters: {
    docs: {
      description: {
        component:
          "Reasons to get in touch, written as endings to the heading's sentence. A filled brand band: six cases two to a row, each with a short label, then the easter egg and the two actions along the foot. It is the only saturated block in the page body, which is what keeps it from being scrolled past. The copy comes from the translation files, so use the language toolbar to see the Hungarian version.",
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
          "Constrained to a phone-sized width, where the cases fall back to one column and the two buttons stack full width under the easter egg.",
      },
    },
  },
  render: () => (
    <div style={{ maxWidth: 342 }}>
      <LetsTalk />
    </div>
  ),
};
