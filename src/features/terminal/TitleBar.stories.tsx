import type { Meta, StoryObj } from "@storybook/react-vite";

import TitleBar from "./TitleBar";

const meta = {
  title: "Terminal/TitleBar",
  component: TitleBar,
  parameters: {
    docs: {
      description: {
        component:
          "The bar across the top of the terminal: the three buttons, and the path the window is sitting in. While the window floats over the page it is also what the window is carried by, so it takes the grab cursor; docked, it is a bar like any other. A double-click on it rolls the window up or down.",
      },
    },
  },
  args: {
    onClose: () => {},
    onShade: () => {},
    onZoom: () => {},
    path: "~/kulcsarrudolf.com",
    shaded: false,
    pressed: false,
    dragLabel: "Move the terminal",
    labels: {
      close: "Close the terminal",
      shade: "Roll the terminal up",
      unshade: "Roll the terminal down",
      float: "Float the terminal over the page",
      dock: "Put the terminal back on the page",
    },
  },
  render: (args) => (
    <div className="overflow-hidden rounded-xl bg-gray-800 shadow-md">
      <TitleBar {...args} />
      <div className="px-4 py-5 font-mono text-[15px] text-gray-300">~ $</div>
    </div>
  ),
} satisfies Meta<typeof TitleBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Draggable: Story = {
  args: {
    pressed: true,
    dragProps: {
      onPointerDown: () => {},
      onPointerMove: () => {},
      onPointerUp: () => {},
      onPointerCancel: () => {},
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "How the bar looks once the window floats: it takes the grab cursor, because it is now the handle the window is moved by.",
      },
    },
  },
};
