import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import BisectActions from "./BisectActions";

const meta = {
  title: "Bisect/BisectActions",
  component: BisectActions,
  parameters: {
    docs: {
      description: {
        component:
          "The row under the board: Retry takes the line or the cut back to start again (R), Cut cuts along the line once there is one (Enter), and once the result is showing the same button becomes Next (Space). Both are there from the start and light up when they have something to do. The key badges hide on a touch screen.",
      },
    },
  },
  args: {
    canRetry: false,
    canCut: false,
    cutMade: false,
    last: false,
    onRetry: fn(),
    onCut: fn(),
    onNext: fn(),
  },
  render: (args) => (
    <div className="dark w-[26rem] rounded-xl bg-gray-800 p-6 font-mono">
      <BisectActions {...args} />
    </div>
  ),
} satisfies Meta<typeof BisectActions>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BeforeTheLine: Story = {};

export const LineDrawn: Story = {
  args: { canRetry: true, canCut: true },
};

export const AfterTheCut: Story = {
  args: { canRetry: true, cutMade: true },
};

export const LastShape: Story = {
  args: { canRetry: true, cutMade: true, last: true },
};
