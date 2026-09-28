import type { Meta, StoryObj } from "@storybook/react-vite";

import Bisect from "./Bisect";

const meta = {
  title: "Bisect/Bisect",
  component: Bisect,
  parameters: {
    docs: {
      description: {
        component:
          "The whole game, without the dialog around it: twenty developer icons in a shuffled order, each to be cut into two equal halves with one straight line. Only a shape's first cut counts, and 48:52 or better wins. After the last shape comes the summary.",
      },
    },
  },
  render: () => (
    <div className="dark w-[26rem] rounded-xl bg-gray-800 px-5 py-6">
      <Bisect />
    </div>
  ),
} satisfies Meta<typeof Bisect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
