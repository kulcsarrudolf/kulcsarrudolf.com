import type { Meta, StoryObj } from "@storybook/react-vite";

import { ArrowIcon, TerminalIcon } from "./icons";

const meta = {
  title: "Terminal/Icons",
  parameters: {
    docs: {
      description: {
        component:
          'The two icons the terminal draws by hand: the 14px arrow in front of each "Where next?" link, at the stroke weight of the mono text beside it, and the 20px prompt on the button in the corner that brings a closed terminal back.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="flex flex-col gap-3 rounded-xl bg-gray-800 p-6 font-mono text-[15px] text-brand-on-dark">
      <div className="flex items-center gap-3">
        <ArrowIcon />
        <span>ArrowIcon</span>
      </div>
      <div className="flex items-center gap-3">
        <TerminalIcon />
        <span>TerminalIcon</span>
      </div>
    </div>
  ),
};
