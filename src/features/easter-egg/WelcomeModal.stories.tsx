import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import WelcomeModal from "./WelcomeModal";

const meta = {
  title: "Easter egg/WelcomeModal",
  component: WelcomeModal,
  args: {
    onClose: fn(),
  },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Full-screen overlay shown after the avatar easter egg. It picks a random quote on mount; the button swaps it for the Sudoku modal.",
      },
    },
  },
} satisfies Meta<typeof WelcomeModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
