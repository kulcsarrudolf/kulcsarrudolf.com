import type { Meta, StoryObj } from "@storybook/react-vite";

import { CheckIcon, CopyIcon, FinishIcon, NextIcon, RetryIcon } from "./icons";

const ICONS = { RetryIcon, NextIcon, FinishIcon, CopyIcon, CheckIcon };

const meta = {
  title: "Bisect/Icons",
  parameters: {
    docs: {
      description: {
        component:
          "The icons on bisect's buttons, 18px and stroked in the colour of the label beside them: going again, moving on, the results at the end of a run, and copying them.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="flex flex-col gap-3 rounded-xl bg-gray-800 p-6 font-mono text-sm text-brand-on-dark">
      {Object.entries(ICONS).map(([name, Icon]) => (
        <div key={name} className="flex items-center gap-3">
          <Icon />
          <span>{name}</span>
        </div>
      ))}
    </div>
  ),
};
