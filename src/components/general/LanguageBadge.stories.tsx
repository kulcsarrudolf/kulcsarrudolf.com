import type { Meta, StoryObj } from "@storybook/react-vite";

import LanguageBadge from "./LanguageBadge";

const meta = {
  title: "General/LanguageBadge",
  component: LanguageBadge,
  args: { lang: "hu" },
  argTypes: {
    lang: { control: "inline-radio", options: ["en", "hu"] },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Marks a Hungarian post or project in a list of mostly English ones. English is the default, so it goes unmarked and the badge renders nothing at all.",
      },
    },
  },
  render: (args) => (
    <p className="font-bold">
      <LanguageBadge {...args} />
      Hogyan írok blogot Markdownban
    </p>
  ),
} satisfies Meta<typeof LanguageBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Hungarian: Story = {};

export const English: Story = { args: { lang: "en" } };
