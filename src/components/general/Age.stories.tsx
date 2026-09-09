import type { Meta, StoryObj } from "@storybook/react-vite";

import Age from "./Age";

const meta = {
  title: "General/Age",
  component: Age,
  parameters: {
    docs: {
      description: {
        component:
          "Renders the author's current age. The value is computed in an effect so the server render and the first client render agree; it is empty for a moment before hydration.",
      },
    },
  },
  render: () => (
    <p>
      I'm <Age /> years old.
    </p>
  ),
} satisfies Meta<typeof Age>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
