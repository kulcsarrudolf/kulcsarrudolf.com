import type { Meta, StoryObj } from "@storybook/react-vite";

import JsOutput from "./JsOutput";

const meta = {
  title: "Terminal/JsOutput",
  component: JsOutput,
  parameters: {
    docs: {
      description: {
        component:
          "What a line typed at the `js` console printed: its logs, then the value it came to behind an arrow, or the error it threw.",
      },
    },
  },
  args: {
    lines: [{ tone: "result", text: "{name: 'Rudolf', languages: ['en', 'hu']}" }],
  },
  render: (args) => (
    <div className="rounded-xl bg-gray-800 p-6 font-mono text-[15px] leading-[1.6]">
      <JsOutput {...args} />
    </div>
  ),
} satisfies Meta<typeof JsOutput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Result: Story = {};

export const Logs: Story = {
  args: {
    lines: [
      { tone: "log", text: "hello from the page" },
      { tone: "warn", text: "this is a warning" },
      { tone: "result", text: "undefined" },
    ],
  },
};

export const Thrown: Story = {
  args: {
    lines: [{ tone: "error", text: "Uncaught ReferenceError: foo is not defined" }],
  },
};
