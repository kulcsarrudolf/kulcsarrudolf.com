import type { Meta, StoryObj } from "@storybook/react-vite";

import Footer from "./Footer";

const meta = {
  title: "Layout/Footer/Footer",
  component: Footer,
  parameters: {
    docs: {
      description: {
        component:
          "Language selector on the left, copyright on the right; both stack on small screens. Clicking a language updates the story router's `?lang=` and the copyright text follows.",
      },
    },
  },
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Mobile: Story = {
  globals: { viewport: { value: "mobile1", isRotated: false } },
};
