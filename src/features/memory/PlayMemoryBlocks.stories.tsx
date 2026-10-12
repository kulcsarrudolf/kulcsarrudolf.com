import type { Meta, StoryObj } from "@storybook/react-vite";

import PlayMemoryBlocks from "./PlayMemoryBlocks";

const meta = {
  title: "Memory/PlayMemoryBlocks",
  component: PlayMemoryBlocks,
  parameters: {
    docs: {
      description: {
        component:
          "The button a blog post places to offer the game: it opens Memory Blocks over the page, the same window the terminal's `memory` command opens.",
      },
    },
  },
} satisfies Meta<typeof PlayMemoryBlocks>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
