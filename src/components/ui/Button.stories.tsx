import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import Button from "./Button";

const meta = {
  title: "UI/Button",
  component: Button,
  args: {
    children: "Send me a message",
    variant: "primary",
    onClick: fn(),
  },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["primary", "secondary", "onBrand", "onBrandOutline"],
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "The site has two buttons, and the same pair inverted for brand blue. `primary` is the filled brand one and there is only ever one of them in view; `secondary` is white with a grey hairline. `onBrand` and `onBrandOutline` are the pair the Let's Talk band uses, where the background is already blue. Anchors and router links that have to read as buttons use the `buttonClasses` helper instead.",
      },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: { variant: "secondary", children: "Schedule a call" },
};

export const SideBySide: Story = {
  render: (args) => (
    <div className="flex flex-col gap-2.5 sm:flex-row sm:gap-3">
      <Button {...args} />
      <Button {...args} variant="secondary">
        Schedule a call
      </Button>
    </div>
  ),
};

export const OnBrand: Story = {
  args: { variant: "onBrand" },
  parameters: {
    docs: {
      description: {
        story:
          "The inverted pair, drawn on the blue they are meant for. Anywhere else they are invisible.",
      },
    },
  },
  render: (args) => (
    <div className="flex flex-col gap-2.5 rounded-xl bg-brand p-6 sm:flex-row sm:gap-3">
      <Button {...args} />
      <Button {...args} variant="onBrandOutline">
        Schedule a call
      </Button>
    </div>
  ),
};

export const Disabled: Story = {
  args: { disabled: true },
};
