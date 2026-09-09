import type { Meta, StoryObj } from "@storybook/react-vite";

import Note from "./Note";

const meta = {
  title: "Typography/Note",
  component: Note,
  parameters: {
    docs: {
      description: {
        component:
          "Small muted print for a parting aside, a step quieter than a Lead and not meant to be read as body copy.",
      },
    },
  },
  args: {
    children: "There is more on GitHub, including the things that never shipped.",
  },
  argTypes: {
    children: { control: "text" },
  },
} satisfies Meta<typeof Note>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
