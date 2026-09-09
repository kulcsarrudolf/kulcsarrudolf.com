import type { Meta, StoryObj } from "@storybook/react-vite";

import WeddingCountdown from "./WeddingCountdown";

const meta = {
  title: "Wedding/WeddingCountdown",
  component: WeddingCountdown,
  args: {
    lang: "hu",
  },
  argTypes: {
    lang: {
      control: "radio",
      options: ["hu", "ro", "en"],
      description: "This page has its own translations (hu, ro, en) and ignores the global language toolbar.",
    },
  },
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof WeddingCountdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Hungarian: Story = {};

export const Romanian: Story = { args: { lang: "ro" } };

export const English: Story = { args: { lang: "en" } };
