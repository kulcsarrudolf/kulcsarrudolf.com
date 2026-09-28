import type { Meta, StoryObj } from "@storybook/react-vite";

import BisectStatus from "./BisectStatus";
import type { Cut, Verdict } from "./board";

const result = (offBy: number, verdict: Verdict): Cut => ({
  line: { from: [0, 0], to: [0, 1] },
  parts: [
    { share: (500 - offBy) / 1000, centroid: null },
    { share: (500 + offBy) / 1000, centroid: null },
  ],
  tenths: [500 - offBy, 500 + offBy],
  offBy,
  verdict,
});

const meta = {
  title: "Bisect/BisectStatus",
  component: BisectStatus,
  parameters: {
    docs: {
      description: {
        component:
          "The line under the board: how to cut until there is a line, how to let go of it or take it back while it is drawn, then the two shares and the verdict. 49.5 or better is perfect, 48.0 or better wins. It keeps its height throughout, so nothing below it moves when a cut lands.",
      },
    },
  },
  args: { aiming: null, cut: null, practice: false },
  render: (args) => (
    <div className="w-[22rem] rounded-xl bg-gray-800 p-6 font-mono text-gray-300">
      <BisectStatus {...args} />
    </div>
  ),
} satisfies Meta<typeof BisectStatus>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BeforeTheCut: Story = {};

export const AimingWithAPointer: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "A finger or the mouse is drawing a line. Only the first cut counts, so the way to take the line back is said while it can still be taken.",
      },
    },
  },
  args: { aiming: "pointer" },
};

export const AimingWithTheKeyboard: Story = {
  args: { aiming: "keys" },
};

export const Perfect: Story = {
  args: { cut: result(3, "perfect") },
};

export const Win: Story = {
  args: { cut: result(17, "win") },
};

export const Miss: Story = {
  args: { cut: result(94, "miss") },
};

export const Practice: Story = {
  parameters: {
    docs: {
      description: {
        story: "A second cut of the same shape, which the run does not count.",
      },
    },
  },
  args: { cut: result(1, "perfect"), practice: true },
};
