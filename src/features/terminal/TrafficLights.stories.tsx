import type { Meta, StoryObj } from "@storybook/react-vite";

import TrafficLights from "./TrafficLights";

const meta = {
  title: "Terminal/TrafficLights",
  component: TrafficLights,
  parameters: {
    docs: {
      description: {
        component:
          "The three dots in the terminal's title bar, which on this window are buttons rather than decoration: red closes it and leaves the button in the page's corner as the way back, amber rolls it up to the bar, and green either lifts it over the page it belongs to or fills the screen with it. Hover the group to bring the glyphs up, the way a Mac does.",
      },
    },
  },
  args: {
    onClose: () => {},
    onShade: () => {},
    onZoom: () => {},
    shaded: false,
    pressed: false,
    labels: {
      close: "Close the terminal",
      shade: "Roll the terminal up",
      unshade: "Roll the terminal down",
      float: "Float the terminal over the page",
      dock: "Put the terminal back on the page",
    },
  },
  render: (args) => (
    <div className="flex h-10 items-center gap-2 rounded-t-xl bg-gray-700 px-4">
      <TrafficLights {...args} />
      <span className="ml-2 font-mono text-[13px] text-gray-400">~/kulcsarrudolf.com</span>
    </div>
  ),
} satisfies Meta<typeof TrafficLights>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Shaded: Story = {
  args: { shaded: true },
  parameters: {
    docs: {
      description: {
        story:
          "Rolled up: the amber dot carries a + instead of a −, since it is now the way back down.",
      },
    },
  },
};

export const GreenEngaged: Story = {
  args: { pressed: true },
  parameters: {
    docs: {
      description: {
        story:
          "Whatever green did has been done: the window is over the page it was lifted from, or filling the screen. The dot points back down, since pressing it undoes that.",
      },
    },
  },
};
