import type { Meta, StoryObj } from "@storybook/react-vite";

import PerfectRun from "./PerfectRun";

const meta = {
  title: "Memory/PerfectRun",
  component: PerfectRun,
  args: { seed: 3 },
  parameters: {
    docs: {
      description: {
        component:
          "A player with a perfect memory clearing a beginner board, for the blog post on the game's maths. It starts once it is half in view, unless the reader asked for less motion, and the caption says why each turn went the way it did. The small picture on a face-down block is what the player remembers.",
      },
    },
  },
} satisfies Meta<typeof PerfectRun>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The deal the blog post describes: every kind of turn shows up, and it clears in 12 pairs. */
export const Default: Story = {};

/** A fresh deal on every visit. */
export const Random: Story = {
  args: { seed: undefined },
};
