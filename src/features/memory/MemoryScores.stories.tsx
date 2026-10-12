import type { Meta, StoryObj } from "@storybook/react-vite";

import MemoryScores from "./MemoryScores";
import { SYSTEM_TEXT } from "./win";

const meta = {
  title: "Memory/MemoryScores",
  component: MemoryScores,
  args: {
    scores: [
      { name: "Rudolf", seconds: 41, pairs: 14 },
      { name: "Nóra", seconds: 47, pairs: 12 },
      { name: "Anonymous", seconds: 63, pairs: 19 },
    ],
  },
  parameters: {
    docs: {
      description: {
        component: "One skill's high score list, fastest first, with the pairs each clear took.",
      },
    },
  },
  render: (args) => (
    <div className={`w-80 border-2 border-black bg-white p-4 ${SYSTEM_TEXT}`}>
      <MemoryScores {...args} />
    </div>
  ),
} satisfies Meta<typeof MemoryScores>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NewHighScore: Story = {
  parameters: { docs: { description: { story: "The place just earned, picked out." } } },
  args: { highlight: 1 },
};

export const Empty: Story = {
  args: { scores: [] },
};
