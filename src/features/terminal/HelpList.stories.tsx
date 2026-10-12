import type { Meta, StoryObj } from "@storybook/react-vite";

import HelpList from "./HelpList";

const meta = {
  title: "Terminal/HelpList",
  component: HelpList,
  parameters: {
    docs: {
      description: {
        component:
          "What `help` and `commands` print: one command per line, its names in bold and a short description in italics.",
      },
    },
  },
  render: () => (
    <div className="rounded-xl bg-gray-800 p-6 font-mono text-[15px] leading-[1.6]">
      <HelpList />
    </div>
  ),
} satisfies Meta<typeof HelpList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
