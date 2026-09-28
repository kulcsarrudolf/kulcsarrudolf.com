import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { fn } from "storybook/test";

import BisectBoard from "./BisectBoard";
import { CENTER, type Cut, cut, place } from "./board";
import { type Line, lineAt } from "./geometry";
import { SHAPES } from "./shapes";

const shapeNamed = (id: string) => place(SHAPES.find((shape) => shape.id === id) ?? SHAPES[0]);

const gitBranch = shapeNamed("git-branch");

const meta = {
  title: "Bisect/BisectBoard",
  component: BisectBoard,
  parameters: {
    docs: {
      description: {
        component:
          "The board a shape is cut on. Press and drag across it to draw a line, and let go to cut: the halves part along the line and each shows its share. With the board focused, the arrow keys bring a line up, turn it and slide it, and Enter cuts. The first two stories are playable.",
      },
    },
  },
  args: {
    shape: gitBranch,
    aim: null,
    cut: null,
    onAim: fn(),
    onCut: fn(),
    label: "Board with the shape git-branch",
  },
  argTypes: {
    shape: {
      options: SHAPES.map((shape) => shape.id),
      mapping: Object.fromEntries(SHAPES.map((shape) => [shape.id, place(shape)])),
      control: { type: "select" },
    },
  },
  render: (args) => (
    <div className="w-[22rem] rounded-xl bg-gray-800 p-6">
      <BisectBoard {...args} />
    </div>
  ),
} satisfies Meta<typeof BisectBoard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Holds the line and the cut the way the game does, so the board can be played. */
const Playable = (args: Parameters<typeof BisectBoard>[0]) => {
  const [aim, setAim] = useState<Line | null>(null);
  const [last, setLast] = useState<Cut | null>(null);
  return (
    <div className="w-[22rem] rounded-xl bg-gray-800 p-6">
      <BisectBoard
        {...args}
        aim={aim}
        cut={last}
        onAim={(line) => {
          setAim(line);
          if (line) setLast(null);
        }}
        onCut={(line) => {
          setAim(null);
          setLast(cut(args.shape, line));
        }}
      />
    </div>
  );
};

export const Default: Story = {
  render: (args) => <Playable {...args} />,
};

export const EveryShape: Story = {
  parameters: {
    docs: {
      description: {
        story: "Pick any of the twenty shapes from the `shape` control and cut it.",
      },
    },
  },
  args: { shape: shapeNamed("whale") },
  render: (args) => <Playable {...args} key={args.shape.id} />,
};

export const Aiming: Story = {
  parameters: {
    docs: {
      description: {
        story: "A line being drawn: the shape takes a colour per side, and nothing is scored yet.",
      },
    },
  },
  args: { aim: lineAt(CENTER, 70, 6) },
};

export const AfterTheCut: Story = {
  parameters: {
    docs: {
      description: {
        story: "Let go: the halves part along the line and each carries its share.",
      },
    },
  },
  args: { cut: cut(gitBranch, lineAt(CENTER, 70, 6)) },
};
