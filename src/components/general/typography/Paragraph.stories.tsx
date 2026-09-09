import type { Meta, StoryObj } from "@storybook/react-vite";

import HighlightP from "./HighlightP";
import Paragraph from "./Paragraph";

const meta = {
  title: "Typography/Paragraph",
  component: Paragraph,
  args: {
    children:
      "I'm a full-stack software engineer. I write about the things I'm learning and building, mostly around React, Node.js and AI tooling.",
  },
  argTypes: {
    children: { control: "text" },
  },
} satisfies Meta<typeof Paragraph>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithHighlight: Story = {
  args: {
    children: (
      <>
        I'm a <HighlightP>full-stack software engineer</HighlightP> based in Transylvania, building
        web apps and the occasional open source library.
      </>
    ),
  },
};
