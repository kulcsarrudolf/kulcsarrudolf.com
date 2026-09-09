import type { Meta, StoryObj } from "@storybook/react-vite";

import CardGrid from "./CardGrid";
import QuoteCard from "@/components/quote/QuoteCard";
import quotes from "@/components/quote/quotes";

const meta = {
  title: "General/CardGrid",
  component: CardGrid,
  parameters: {
    docs: {
      description: {
        component:
          "The two-column card layout behind /projects and /quotes. It takes no options on purpose: both pages get the same gap and the same breakpoint, so two grids never drift apart by a value nobody chose.",
      },
    },
  },
  args: {
    children: quotes
      .slice(0, 4)
      .map((quote) => <QuoteCard key={quote.id} quote={quote} size="md" />),
  },
} satisfies Meta<typeof CardGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const OddNumberOfCards: Story = {
  args: {
    children: quotes
      .slice(0, 3)
      .map((quote) => <QuoteCard key={quote.id} quote={quote} size="md" />),
  },
};
