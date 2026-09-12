import type { Meta, StoryObj } from "@storybook/react-vite";

import { ArrowIcon } from "./icons";

const meta = {
  title: "Home/Terminal intro/Icons",
  parameters: {
    docs: {
      description: {
        component:
          'The 14px arrow in front of each "Where next?" link in the terminal, drawn by hand so it matches the stroke weight of the mono text beside it.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="flex items-center gap-3 rounded-xl bg-gray-800 p-6 font-mono text-[15px] text-blue-300">
      <ArrowIcon />
      <span>ArrowIcon</span>
    </div>
  ),
};
