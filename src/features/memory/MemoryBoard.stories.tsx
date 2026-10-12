import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { type Board, deal, flip, settle } from "./engine";
import MemoryBoard from "./MemoryBoard";

// A fixed sequence rather than Math.random, so the stories look the same on every visit.
const seeded = (seed: number) => () => {
  seed = (seed * 16807) % 2147483647;
  return seed / 2147483647;
};

/** A board part way through: the first matching pair found and gone, and one block showing. */
const midGame = (): Board => {
  const board = deal("intermediate", seeded(7));
  const first = board.blocks[0].picture;
  const twin = board.blocks.findIndex((block, index) => index > 0 && block.picture === first);
  return flip(settle(flip(flip(board, 0), twin)), 5);
};

const meta = {
  title: "Memory/MemoryBoard",
  component: MemoryBoard,
  args: { board: deal("beginner", seeded(1)), onFlip: fn() },
  parameters: {
    docs: {
      description: {
        component:
          "The blocks on the aqua board, in as many columns as the skill deals. One block takes Tab and the arrow keys move between them.",
      },
    },
  },
  render: (args) => (
    <div className="flex justify-center bg-win-aqua p-6">
      <MemoryBoard {...args} />
    </div>
  ),
} satisfies Meta<typeof MemoryBoard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Beginner: Story = {};

export const MidGame: Story = {
  args: { board: midGame() },
};

export const Expert: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Ten across, the board from the 1991 screenshots. On a phone held upright it stands six across instead.",
      },
    },
  },
  args: { board: deal("expert", seeded(3)) },
};
