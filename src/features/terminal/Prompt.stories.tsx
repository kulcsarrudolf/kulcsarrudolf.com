import type { Meta, StoryObj } from "@storybook/react-vite";

import Prompt from "./Prompt";

const meta = {
  title: "Terminal/Prompt",
  component: Prompt,
  parameters: {
    docs: {
      description: {
        component:
          "The `~ $` in front of every command line in the terminal, or the question `send-message` is asking in its place. Decoration to a screen reader, so it is hidden from one.",
      },
    },
  },
  render: (args) => (
    <p className="flex gap-2.5 rounded-xl bg-gray-800 p-6 font-mono text-[15px]">
      <Prompt {...args} />
      <span className="text-white">{args.label ? "Jane Doe" : "./intro.sh"}</span>
    </p>
  ),
} satisfies Meta<typeof Prompt>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithLabel: Story = {
  args: { label: "name:" },
};
