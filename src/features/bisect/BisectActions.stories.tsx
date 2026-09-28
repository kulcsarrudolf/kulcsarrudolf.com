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
          "The row under the board: Retry takes the cut back to cut the shape again (R), and Next moves on once the first cut is in (Space). Both are there from the start and light up when they have something to do. The key badges hide on a touch screen.",
      },
    },
  },
  args: { canRetry: false, canMoveOn: false, last: false, onRetry: fn(), onNext: fn() },
  render: (args) => (
    <div className="dark w-[26rem] rounded-xl bg-gray-800 p-6 font-mono">
      <BisectActions {...args} />
    </div>
  ),
} satisfies Meta<typeof BisectActions>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BeforeTheCut: Story = {};

export const AfterTheCut: Story = {
  args: { canRetry: true, canMoveOn: true },
};

export const LastShape: Story = {
  args: { canRetry: true, canMoveOn: true, last: true },
};
