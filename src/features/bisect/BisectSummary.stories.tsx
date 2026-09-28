import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import BisectSummary from "./BisectSummary";
import type { Cut, Verdict } from "./board";

const result = (offBy: number): Cut => {
  const verdict: Verdict = offBy <= 5 ? "perfect" : offBy <= 20 ? "win" : "miss";
  return {
    line: { from: [0, 0], to: [0, 1] },
    parts: [
      { share: (500 - offBy) / 1000, centroid: null },
      { share: (500 + offBy) / 1000, centroid: null },
    ],
    tenths: [500 - offBy, 500 + offBy],
    offBy,
    verdict,
  };
};

const meta = {
  title: "Bisect/BisectSummary",
  component: BisectSummary,
  parameters: {
    docs: {
      description: {
        component:
          "The end of a run: how many of the twenty cuts won, one tile per shape (green perfect, amber a win, grey a miss), the perfect count, the average and the closest miss. Copy result puts the tiles on the clipboard, Wordle style.",
      },
    },
  },
  args: {
    scores: [2, 14, 35, 9, 0, 61, 18, 4, 27, 12, 8, 90, 3, 19, 44, 7, 1, 22, 16, 5].map(result),
    total: 20,
    onRestart: fn(),
  },
  render: (args) => (
    <div className="dark w-[26rem] rounded-xl bg-gray-800 p-6 font-mono text-gray-300">
      <BisectSummary {...args} />
    </div>
  ),
} satisfies Meta<typeof BisectSummary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Flawless: Story = {
  args: { scores: Array.from({ length: 20 }, (_, i) => result(i % 4)) },
};
