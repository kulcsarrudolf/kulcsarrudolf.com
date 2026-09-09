import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import Modal from "./Modal";

const meta = {
  title: "General/Modal",
  component: Modal,
  args: {
    onClose: fn(),
    closeLabel: "Close",
    children: (
      <div className="text-center">
        <div className="text-4xl mb-4">🎉</div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">You found it</h2>
        <p className="text-gray-600">Full bleed on a phone, a centred card from `md` up.</p>
      </div>
    ),
  },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "The dialog shell behind the welcome easter egg and the Sudoku game: a white panel over a dimmed backdrop that fades and scales in on mount and back out on dismissal. Clicking the backdrop closes it, clicking the panel does not.",
      },
    },
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutCloseButton: Story = {
  args: { closeLabel: undefined },
};

export const DismissedFromInside: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "A function child receives the animated close, for the dialogs that dismiss themselves from a control of their own.",
      },
    },
  },
  args: {
    closeLabel: undefined,
    children: (close: () => void) => (
      <div className="text-center">
        <p className="mb-4 text-gray-600">Done playing?</p>
        <button
          onClick={close}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600"
        >
          End game
        </button>
      </div>
    ),
  },
};
