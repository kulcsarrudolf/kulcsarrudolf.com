import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import CloseButton from "./CloseButton";

const meta = {
  title: "UI/CloseButton",
  component: CloseButton,
  args: {
    label: "Close",
    onClick: fn(),
  },
  parameters: {
    docs: {
      description: {
        component:
          "The × in the corner of a dialog or the menu sheet. The glyph is small but the button is 44px, so it stays comfortably tappable, and `aria-label` gives it a name a multiplication sign cannot.",
      },
    },
  },
  render: (args) => (
    <div className="relative h-40 w-72 rounded-2xl bg-white shadow-2xl">
      <CloseButton {...args} />
    </div>
  ),
} satisfies Meta<typeof CloseButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
