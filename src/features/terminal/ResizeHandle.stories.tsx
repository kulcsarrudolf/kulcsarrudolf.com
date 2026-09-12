import type { Meta, StoryObj } from "@storybook/react-vite";

import ResizeHandle from "./ResizeHandle";

const meta = {
  title: "Terminal/ResizeHandle",
  component: ResizeHandle,
  parameters: {
    docs: {
      description: {
        component:
          "The strip along the bottom of the terminal that drags the window taller or shorter, like the edge of a real one. Only the height moves. It is focusable, so the arrow keys work it too, and a double-click hands the height back to the content.",
      },
    },
  },
  args: {
    label: "Terminal height",
    value: 200,
    min: 160,
    max: 720,
  },
  render: (args) => (
    <div className="overflow-hidden rounded-xl bg-gray-800 shadow-md">
      <div className="h-24" />
      <ResizeHandle {...args} />
    </div>
  ),
} satisfies Meta<typeof ResizeHandle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
