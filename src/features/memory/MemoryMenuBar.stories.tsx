import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import MemoryMenuBar from "./MemoryMenuBar";
import { SYSTEM_TEXT } from "./win";

const meta = {
  title: "Memory/MemoryMenuBar",
  component: MemoryMenuBar,
  args: {
    menus: [
      {
        id: "game",
        label: "Game",
        entries: [
          { label: "New", shortcut: "F2", onSelect: fn() },
          { label: "High Scores...", onSelect: fn() },
          "separator",
          { label: "Exit", onSelect: fn() },
        ],
      },
      {
        id: "skill",
        label: "Skill",
        entries: [
          { label: "Beginner", checked: false, onSelect: fn() },
          { label: "Intermediate", checked: true, onSelect: fn() },
          { label: "Expert", checked: false, onSelect: fn() },
        ],
      },
      { id: "help", label: "Help", entries: [{ label: "How to Play", onSelect: fn() }] },
    ],
  },
  parameters: {
    docs: {
      description: {
        component:
          "The Windows 3.1 menu bar. A click drops a menu; with one open, pointing at another switches to it, and the arrow keys move through the items and across the menus.",
      },
    },
  },
  render: (args) => (
    <div className={`h-48 w-96 border-2 border-black bg-win-aqua ${SYSTEM_TEXT}`}>
      <MemoryMenuBar {...args} />
    </div>
  ),
} satisfies Meta<typeof MemoryMenuBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Closed: Story = {};

export const GameMenu: Story = {
  args: { initialOpen: "game" },
};

export const SkillMenu: Story = {
  parameters: {
    docs: {
      description: { story: "The skill levels, a pick-one group with a tick by the current one." },
    },
  },
  args: { initialOpen: "skill" },
};
