import type { Meta, StoryObj } from "@storybook/react-vite";

import ResizeEdges from "./ResizeEdges";
import type { Direction, GrabProps } from "./useFloatingFrame";

const inert = (_direction: Direction): GrabProps => ({
  onPointerDown: () => {},
  onPointerMove: () => {},
  onPointerUp: () => {},
  onPointerCancel: () => {},
});

const meta = {
  title: "Home/Terminal intro/ResizeEdges",
  component: ResizeEdges,
  parameters: {
    docs: {
      description: {
        component:
          "The eight grab strips around a floating terminal: four sides and four corners, each dragging the edge it sits on. They are invisible by design, so the only thing to look at is the cursor — move the pointer around the edge of the box below and it turns as it crosses onto one.",
      },
    },
  },
  args: { grabProps: inert },
  render: (args) => (
    <div className="relative h-56 w-96 rounded-xl bg-gray-800">
      <div className="flex h-full items-center justify-center font-mono text-[13px] text-gray-500">
        the window
      </div>
      <ResizeEdges {...args} />
    </div>
  ),
} satisfies Meta<typeof ResizeEdges>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
