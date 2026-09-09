import type { Meta, StoryObj } from "@storybook/react-vite";

import Link from "./Link";

const meta = {
  title: "Typography/Link",
  component: Link,
  args: {
    href: "https://react.dev",
    children: "React",
  },
  argTypes: {
    children: { control: "text" },
  },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const InSentence: Story = {
  render: (args) => (
    <p style={{ lineHeight: "2rem" }}>
      Most of my day-to-day work is in <Link {...args} /> and{" "}
      <Link href="https://nodejs.org">Node.js</Link>.
    </p>
  ),
};
