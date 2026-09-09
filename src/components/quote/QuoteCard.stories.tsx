import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { quote } from "@/stories/fixtures";

import QuoteCard from "./QuoteCard";

const meta = {
  title: "Quote/QuoteCard",
  component: QuoteCard,
  args: {
    quote,
    size: "lg",
  },
  argTypes: {
    size: { control: "inline-radio", options: ["md", "lg"] },
  },
  parameters: {
    docs: {
      description: {
        component:
          "A quotation and its author in a bordered card. `lg` is the single quote on the home page and in the welcome dialog; `md` is a card in the two-column grid on /quotes, where the type steps down so a long quote still fits the column.",
      },
    },
  },
} satisfies Meta<typeof QuoteCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Large: Story = { args: { centered: true } };

export const Medium: Story = { args: { size: "md", interactive: true } };

export const Clickable: Story = {
  args: { centered: true, interactive: true, onClick: fn() },
};
