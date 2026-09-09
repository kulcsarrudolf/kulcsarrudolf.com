import type { Meta, StoryObj } from "@storybook/react-vite";

import SocialMediaLinks from "./SocialMediaLinks";

const meta = {
  title: "Navbar/SocialMediaLinks",
  component: SocialMediaLinks,
  globals: { backgrounds: { value: "navbar" } },
  decorators: [
    (Story) => (
      <div className="p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SocialMediaLinks>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const TightSpacing: Story = {
  args: { iconClassName: "ml-0 mr-4" },
};
