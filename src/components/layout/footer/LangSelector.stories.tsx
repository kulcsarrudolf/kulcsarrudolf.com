import type { Meta, StoryObj } from "@storybook/react-vite";

import LangSelector from "./LangSelector";

const meta = {
  title: "Layout/Footer/LangSelector",
  component: LangSelector,
} satisfies Meta<typeof LangSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
