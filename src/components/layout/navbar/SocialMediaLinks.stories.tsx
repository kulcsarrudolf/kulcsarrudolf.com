import type { Meta, StoryObj } from "@storybook/react-vite";

import SocialMediaLinks from "./SocialMediaLinks";

const meta = {
  title: "Layout/Navbar/SocialMediaLinks",
  component: SocialMediaLinks,
  parameters: {
    docs: {
      description: {
        component:
          "`sm` on the blue bar, behind a hairline divider, so the icons read as a footnote rather than as peers of the navigation. `md` with 44px targets inside the menu sheet.",
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
} satisfies Meta<typeof SocialMediaLinks>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InTheBar: Story = {
  args: { size: "sm", tone: "onBrand" },
};

export const InTheSheet: Story = {
  args: { size: "md", tone: "onSurface", padded: true },
  globals: { backgrounds: { value: "white" } },
};
