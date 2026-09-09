import type { Meta, StoryObj } from "@storybook/react-vite";

import CircularProgress from "./CircularProgress";

const meta = {
  title: "Navbar/CircularProgress",
  component: CircularProgress,
  args: {
    progress: 65,
    size: 48,
    strokeWidth: 3,
  },
  argTypes: {
    progress: { control: { type: "range", min: 0, max: 100, step: 1 } },
    size: { control: { type: "number", min: 16, max: 200 } },
    strokeWidth: { control: { type: "number", min: 1, max: 12 } },
  },
  parameters: {
    docs: {
      description: {
        component: "The green ring that fills up around the navbar avatar while it is hovered. It is absolutely positioned, so the story wraps it in a relative box.",
      },
    },
  },
  render: (args) => (
    <div
      className="relative flex items-center justify-center rounded-full bg-brand"
      style={{ width: args.size, height: args.size }}
    >
      <img
        src="/images/me-logo.png"
        alt=""
        className="rounded-full border-2 border-white p-0.5"
        style={{ width: (args.size ?? 48) - 8, height: (args.size ?? 48) - 8 }}
      />
      <CircularProgress {...args} />
    </div>
  ),
} satisfies Meta<typeof CircularProgress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = { args: { progress: 0 } };

export const Complete: Story = { args: { progress: 100 } };

export const Large: Story = { args: { size: 120, strokeWidth: 6 } };
