import type { Meta, StoryObj } from "@storybook/react-vite";

import WhereNext from "./WhereNext";

const meta = {
  title: "Home/Terminal intro/WhereNext",
  component: WhereNext,
  parameters: {
    docs: {
      description: {
        component:
          'The "Where next?" line the intro and `ls` print: the three pages the terminal points at, each behind an arrow. The links carry the visitor\'s language.',
      },
    },
  },
  render: () => (
    <div className="rounded-xl bg-gray-800 p-6 font-mono text-[15px] leading-[1.6]">
      <WhereNext />
    </div>
  ),
} satisfies Meta<typeof WhereNext>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Narrow: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "At a phone width the label keeps its own line and the links wrap as a group under it.",
      },
    },
  },
  render: () => (
    <div
      className="rounded-xl bg-gray-800 p-4 font-mono text-[15px] leading-[1.6]"
      style={{ maxWidth: 342 }}
    >
      <WhereNext />
    </div>
  ),
};
