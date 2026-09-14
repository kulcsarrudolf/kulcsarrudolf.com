import type { Meta, StoryObj } from "@storybook/react-vite";

import PhoneFrame from "./PhoneFrame";

const meta = {
  title: "UI/PhoneFrame",
  component: PhoneFrame,
  args: {
    children: (
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-800 mb-2 dark:text-gray-100">On the phone</h2>
        <p className="text-gray-600 dark:text-gray-400">
          A to-scale Samsung Galaxy S26 from `md` up, and nothing but this copy below it.
        </p>
      </div>
    ),
  },
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A Samsung Galaxy S26 drawn to scale around a dialog's content from `md` up: the body ratio, the bezels, the corners, the punch hole and the side keys. On a phone screen the children render as they are, since the phone in the hand is already the frame. Pair it with a `frameless` Modal.",
      },
    },
  },
} satisfies Meta<typeof PhoneFrame>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
