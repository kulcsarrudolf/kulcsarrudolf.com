import type { Meta, StoryObj } from "@storybook/react-vite";

import Prompt from "./Prompt";

const meta = {
  title: "Home/Terminal intro/Prompt",
  component: Prompt,
  parameters: {
    docs: {
      description: {
        component:
          "The `~ $` in front of every command line in the terminal. Decoration to a screen reader, so it is hidden from one.",
      },
    },
  },
  render: () => (
    <p className="flex gap-2.5 rounded-xl bg-gray-800 p-6 font-mono text-[15px]">
      <Prompt />
      <span className="text-white">./intro.sh</span>
    </p>
  ),
} satisfies Meta<typeof Prompt>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
