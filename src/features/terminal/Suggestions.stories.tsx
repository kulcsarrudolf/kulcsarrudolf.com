import type { Meta, StoryObj } from "@storybook/react-vite";

import Suggestions from "./Suggestions";

const meta = {
  title: "Terminal/Suggestions",
  component: Suggestions,
  parameters: {
    docs: {
      description: {
        component:
          "The row of candidates under the prompt, once Tab has more than one to walk through. The one on the line is lit and described underneath, and Tab and Shift+Tab move along the row. A click or a tap picks one too.",
      },
    },
  },
  args: {
    id: "suggestions",
    label: "Suggestions",
    candidates: [
      { value: "bisect", source: "command", hint: "bisect" },
      { value: "blog/", source: "command", hint: "navigate", page: "blog/" },
      { value: "bisect.sh", source: "command", hint: "bisect" },
    ],
    selected: 0,
    description: "a game: cut each shape in half",
    onPick: () => {},
  },
  render: (args) => (
    <div className="rounded-xl bg-gray-800 p-6 font-mono text-[15px] leading-[1.6]">
      <Suggestions {...args} />
    </div>
  ),
} satisfies Meta<typeof Suggestions>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithHistory: Story = {
  args: {
    candidates: [
      { value: "js", source: "command", hint: "jsConsole" },
      { value: "js [1, 2].map(String)", source: "history", hint: "history" },
      { value: "js document.title", source: "history", hint: "history" },
    ],
    selected: 1,
    description: "from your history",
  },
  parameters: {
    docs: {
      description: {
        story: "Lines from the visitor's own history come after the commands, marked as theirs.",
      },
    },
  },
};

export const InTheJsConsole: Story = {
  args: {
    candidates: [
      { value: "document.title", source: "property", hint: "property" },
      { value: "document.timeline", source: "property", hint: "property" },
      { value: "document.toString", source: "property", hint: "method" },
    ],
    selected: 2,
    description: "a function",
  },
  parameters: {
    docs: {
      description: {
        story: "In the `js` console the candidates are the names on the objects in the page.",
      },
    },
  },
};
