import type { Meta, StoryObj } from "@storybook/react-vite";

import programmingSvg from "./programming.svg";

import FocusCard from "./FocusCard";

const meta = {
  title: "General/FocusCard",
  component: FocusCard,
  args: {
    image: programmingSvg,
    title: "Full-stack development",
    children:
      "Working at InnovatorSpark with React and Node.js. Always exploring and adopting new technologies and development practices.",
  },
  parameters: {
    docs: {
      description: {
        component:
          "One illustrated card on the Currently Focused On rail. The cards share the row when all of them fit and hold 220px once they don't, which is what turns the rail into a scroller.",
      },
    },
  },
  render: (args) => (
    <div className="flex gap-4" style={{ maxWidth: 280 }}>
      <FocusCard {...args} />
    </div>
  ),
} satisfies Meta<typeof FocusCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
