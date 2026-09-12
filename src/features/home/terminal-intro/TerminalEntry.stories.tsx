import type { Meta, StoryObj } from "@storybook/react-vite";

import TerminalEntry from "./TerminalEntry";

const meta = {
  title: "Home/Terminal intro/TerminalEntry",
  component: TerminalEntry,
  parameters: {
    docs: {
      description: {
        component:
          "One run command in the terminal's history: the prompt echoing what was typed, then what it printed. One story per kind of outcome.",
      },
    },
  },
  args: {
    command: "./intro.sh",
    result: { kind: "intro" },
  },
  render: (args) => (
    <div className="rounded-xl bg-gray-800 p-6 font-mono text-[15px] leading-[1.6]">
      <TerminalEntry {...args} />
    </div>
  ),
} satisfies Meta<typeof TerminalEntry>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Intro: Story = {};

export const List: Story = {
  args: { command: "ls", result: { kind: "list" } },
};

export const Help: Story = {
  args: { command: "help", result: { kind: "help" } },
};

export const Navigate: Story = {
  args: {
    command: "cd blog",
    result: { kind: "navigate", destination: { to: "/blog", label: "blog/" } },
  },
};

export const Wedding: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "One of the two commands `help` does not mention: the countdown to the wedding, printed in the window rather than on a page of its own.",
      },
    },
  },
  args: { command: "nr", result: { kind: "wedding" } },
};

export const Sudoku: Story = {
  parameters: {
    docs: {
      description: {
        story: "The other hidden command. The line prints here and the sudoku opens over the page.",
      },
    },
  },
  args: { command: "./sudoku.sh", result: { kind: "sudoku" } },
};

export const NotFound: Story = {
  args: {
    command: "sudo make me a sandwich",
    result: { kind: "notFound", command: "sudo make me a sandwich" },
  },
};

export const Empty: Story = {
  parameters: {
    docs: {
      description: {
        story: "A bare Return: the prompt on its own, which is what a real shell prints.",
      },
    },
  },
  args: { command: "", result: { kind: "empty" } },
};
