import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import type { Verdict } from "./board";
import BisectGallery from "./BisectGallery";
import { SHAPES } from "./shapes";

const PLAYED: readonly (Verdict | null)[] = ["perfect", "miss", "win", null, "miss", "win"];

const meta = {
  title: "Bisect/BisectGallery",
  component: BisectGallery,
  parameters: {
    docs: {
      description: {
        component:
          "Every shape at once, for choosing which one to cut next. A dot marks a shape already cut, in the colour of its result (green perfect, amber a win, grey a miss), and the shape on the board is ringed. Escape goes back without choosing.",
      },
    },
  },
  args: {
    entries: SHAPES.map((shape) => ({ id: shape.id, verdict: null, current: false })),
    onPick: fn(),
    onClose: fn(),
  },
  render: (args) => (
    <div className="dark w-[26rem] rounded-xl bg-gray-800 px-5 py-6 font-mono">
      <BisectGallery {...args} />
    </div>
  ),
} satisfies Meta<typeof BisectGallery>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FreshRun: Story = {
  args: {
    entries: SHAPES.map((shape, i) => ({ id: shape.id, verdict: null, current: i === 0 })),
  },
};

export const MidRun: Story = {
  parameters: {
    docs: {
      description: {
        story: "Five shapes cut, and a sixth on the board without its first cut yet.",
      },
    },
  },
  args: {
    entries: SHAPES.map((shape, i) => ({
      id: shape.id,
      verdict: PLAYED[i] ?? null,
      current: i === 3,
    })),
  },
};
