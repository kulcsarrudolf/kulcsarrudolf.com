import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import NavbarData from "./data";
import NavbarAvatar from "./NavbarAvatar";

const meta = {
  title: "Navbar/NavbarAvatar",
  component: NavbarAvatar,
  args: {
    src: NavbarData.logoSrc,
    alt: "Rudolf",
    onReveal: fn(),
  },
  parameters: {
    docs: {
      description: {
        component:
          "Hover (or long-press on touch) for about seven seconds: a progress ring fills up and `onReveal` fires. Brand owns the modal that opens, because it has to render outside the brand link.",
      },
    },
  },
  globals: { backgrounds: { value: "navbar" } },
  decorators: [
    (Story) => (
      <div className="p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NavbarAvatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
