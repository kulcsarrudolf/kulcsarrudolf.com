import type { Meta, StoryObj } from "@storybook/react-vite";

import FloatingFrame from "./FloatingFrame";
import type { Direction, GrabProps } from "./useFloatingFrame";

const inert = (): GrabProps => ({
  onPointerDown: () => {},
  onPointerMove: () => {},
  onPointerUp: () => {},
  onPointerCancel: () => {},
});

const meta = {
  title: "Terminal/FloatingFrame",
  component: FloatingFrame,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "The terminal once the green button has lifted it off the page: fixed over everything at the position and size it is dragged to, with the eight invisible grab strips around its edges. Move the pointer onto an edge or a corner to see the cursor change. The frame here is fixed to the viewport, so in the docs it sits in the corner of the page rather than of this block.",
      },
    },
  },
  args: {
    rect: { x: 40, y: 80, width: 460, height: 280 },
    shaded: false,
    grabProps: (_direction?: Direction) => inert(),
    children: (
      <div className="flex h-full flex-col overflow-hidden rounded-xl bg-gray-800">
        <div className="flex h-10 shrink-0 items-center gap-2 border-b border-white/10 bg-gray-700 px-4">
          <span className="h-3 w-3 rounded-full bg-traffic-close" />
          <span className="h-3 w-3 rounded-full bg-traffic-shade" />
          <span className="h-3 w-3 rounded-full bg-traffic-zoom" />
          <span className="ml-2 font-mono text-[13px] text-gray-400">~/kulcsarrudolf.com</span>
        </div>
        <div className="flex-1 px-4 py-5 font-mono text-[15px] text-gray-300">~ $</div>
      </div>
    ),
  },
} satisfies Meta<typeof FloatingFrame>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Shaded: Story = {
  args: { shaded: true },
  parameters: {
    docs: {
      description: {
        story:
          "Rolled up while floating: the frame drops its height and lets the title bar decide it, and the grab strips go with the body they were resizing.",
      },
    },
  },
};
