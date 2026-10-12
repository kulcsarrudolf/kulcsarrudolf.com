import type { Meta, StoryObj } from "@storybook/react-vite";

import CommandsTip from "./CommandsTip";

const meta = {
  title: "Terminal/CommandsTip",
  component: CommandsTip,
  parameters: {
    docs: {
      description: {
        component:
          "The highlighted line the intro prints under the greeting, pointing a newcomer at `commands`, which runs the command when clicked.",
      },
    },
  },
  args: { onRun: () => {} },
  render: (args) => (
    <div className="rounded-xl bg-gray-800 p-6 font-mono text-[15px] leading-[1.6]">
      <CommandsTip {...args} />
    </div>
  ),
} satisfies Meta<typeof CommandsTip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Inactive: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "While a `send-message` question or the `js` console has the line, the word is plain text rather than a button.",
      },
    },
  },
  args: { onRun: undefined },
};
