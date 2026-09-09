import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import MenuItems from "./MenuItems";

const meta = {
  title: "Navbar/MenuItems",
  component: MenuItems,
  args: {
    onNavigate: fn(),
  },
  parameters: {
    docs: {
      description: {
        component:
          'One link list, two presentations. The current page marks itself from TanStack Router\'s `data-status="active"`, fuzzy so a post at /blog/<slug> keeps Blog highlighted.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MenuItems>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Bar: Story = {
  args: { variant: "bar" },
  globals: { backgrounds: { value: "navbar" } },
  parameters: {
    docs: {
      description: {
        story:
          "Items appear as they fit: the call to action from 546px, the rest from 706px. Below that this list is empty and the menu button takes over.",
      },
    },
  },
};

export const Sheet: Story = {
  args: { variant: "sheet" },
  globals: { backgrounds: { value: "white" } },
  parameters: {
    docs: {
      description: {
        story:
          "Full-width rows inside the menu sheet: the whole row is the target and the highlight spans it.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[350px] p-4">
        <Story />
      </div>
    ),
  ],
};
