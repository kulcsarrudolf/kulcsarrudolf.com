import type { Meta, StoryObj } from "@storybook/react-vite";

import CurrentFocus from "./CurrentFocus";

const meta = {
  title: "General/CurrentFocus",
  component: CurrentFocus,
  parameters: {
    docs: {
      description: {
        component:
          "Horizontally scrollable cards describing what I am working on. Drag with the mouse or swipe on touch devices; the copy comes from the translation files, so use the language toolbar to see the Hungarian version.",
      },
    },
  },
} satisfies Meta<typeof CurrentFocus>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Narrow: Story = {
  parameters: {
    docs: {
      description: {
        story: "Constrained to a phone-sized width so the cards overflow and the drag-to-scroll behaviour is visible.",
      },
    },
  },
  render: () => (
    <div style={{ maxWidth: 360 }}>
      <CurrentFocus />
    </div>
  ),
};
