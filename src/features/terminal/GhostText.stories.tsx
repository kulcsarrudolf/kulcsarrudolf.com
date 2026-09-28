import type { Meta, StoryObj } from "@storybook/react-vite";

import GhostText from "./GhostText";
import Prompt from "./Prompt";

const meta = {
  title: "Terminal/GhostText",
  component: GhostText,
  parameters: {
    docs: {
      description: {
        component:
          "What could finish the line being typed, in a lighter grey, with the cursor standing on its first letter so that typing reads as writing over it. Tab takes it, and so does a click or a tap. The name of the key sits beside it wherever there is a keyboard to press it on.",
      },
    },
  },
  args: {
    text: "ect",
    keyName: "tab",
    label: "Take the suggestion: bisect",
    onAccept: () => {},
  },
  render: (args) => (
    <p className="flex items-center gap-2.5 rounded-xl bg-gray-800 p-6 font-mono text-[15px]">
      <Prompt />
      <span className="flex min-w-0 items-center">
        <span className="text-white">bis</span>
        <GhostText {...args} />
      </span>
    </p>
  ),
} satisfies Meta<typeof GhostText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const FromTheHistory: Story = {
  args: { text: " [1, 2].map(String)", label: "Take the suggestion: js [1, 2].map(String)" },
  render: (args) => (
    <p className="flex items-center gap-2.5 rounded-xl bg-gray-800 p-6 font-mono text-[15px]">
      <Prompt />
      <span className="flex min-w-0 items-center">
        <span className="text-white">js</span>
        <GhostText {...args} />
      </span>
    </p>
  ),
  parameters: {
    docs: {
      description: {
        story: "A line typed on an earlier visit, offered back with its spacing as it was.",
      },
    },
  },
};
