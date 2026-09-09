import type { Meta, StoryObj } from "@storybook/react-vite";

import CurrentFocus from "./CurrentFocus";

const meta = {
  title: "General/CurrentFocus",
  component: CurrentFocus,
  parameters: {
    docs: {
      description: {
        component:
          "A horizontal rail of cards describing what I am working on. Arrows, a card counter and the dots below say how much is off screen; you can also drag with the mouse, swipe, or focus the rail and use the arrow keys. The copy comes from the translation files, so use the language toolbar to see the Hungarian version.",
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
        story: "Constrained to a phone-sized width so one card shows at a time and the counter, dots and edge fades do their work.",
      },
    },
  },
  render: () => (
    <div style={{ maxWidth: 360 }}>
      <CurrentFocus />
    </div>
  ),
};
