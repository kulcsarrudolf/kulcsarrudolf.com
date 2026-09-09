import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import RailControls from "./RailControls";

const meta = {
  title: "General/RailControls",
  component: RailControls,
  args: {
    counter: "1-3 of 4",
    previousLabel: "Previous",
    nextLabel: "Next",
    canScrollBack: false,
    canScrollForward: true,
    isScrollable: true,
    onPrevious: fn(),
    onNext: fn(),
  },
  parameters: {
    docs: {
      description: {
        component:
          "The counter and arrows beside a rail's heading. They hide rather than unmount when everything fits, so the heading keeps its height. Phones never see them: there is no room beside the title, and the rail is swipeable anyway.",
      },
    },
  },
} satisfies Meta<typeof RailControls>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AtTheStart: Story = {};

export const InTheMiddle: Story = {
  args: { counter: "2-3 of 4", canScrollBack: true },
};

export const AtTheEnd: Story = {
  args: { counter: "2-4 of 4", canScrollBack: true, canScrollForward: false },
};

export const NothingToScroll: Story = {
  args: { isScrollable: false, canScrollForward: false },
};
