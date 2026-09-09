import type { Meta, StoryObj } from "@storybook/react-vite";

import Title from "./Title";

const meta = {
  title: "UI/Typography/Title",
  component: Title,
  args: {
    children: "Hi, I'm Rudolf",
  },
  argTypes: {
    children: { control: "text" },
    mb: { control: { type: "number", min: 0, max: 4, step: 0.5 } },
  },
} satisfies Meta<typeof Title>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CustomMargin: Story = {
  args: { mb: 3 },
  render: (args) => (
    <>
      <Title {...args} />
      <p>Text below the title, pushed down by the custom margin.</p>
    </>
  ),
};
