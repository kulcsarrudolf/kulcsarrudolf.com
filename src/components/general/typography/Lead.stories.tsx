import type { Meta, StoryObj } from "@storybook/react-vite";

import Lead from "./Lead";
import Title from "./Title";

const meta = {
  title: "Typography/Lead",
  component: Lead,
  parameters: {
    docs: {
      description: {
        component:
          "The muted sentence under a page title, saying what the page holds before the content proper starts.",
      },
    },
  },
  args: {
    children:
      "A few things I have built, mostly side projects that started as an itch and kept going.",
  },
  argTypes: {
    children: { control: "text" },
  },
  render: (args) => (
    <>
      <Title>Projects</Title>
      <Lead {...args} />
    </>
  ),
} satisfies Meta<typeof Lead>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
