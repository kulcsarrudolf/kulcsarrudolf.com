import type { Meta, StoryObj } from "@storybook/react-vite";

import TerminalBody from "./TerminalBody";

const meta = {
  title: "Terminal/TerminalBody",
  component: TerminalBody,
  parameters: {
    docs: {
      description: {
        component:
          "Everything under the terminal's title bar: what has been run so far, and the line being typed. It scrolls once the history outgrows it, and a click anywhere in it hands the caret to the prompt the way a real terminal takes focus. Shown here on its own, without the window around it, so the input does nothing.",
      },
    },
  },
  args: {
    entries: [{ id: 0, command: "./intro.sh", result: { kind: "intro" } }],
    step: null,
    busy: false,
    atmosphereEntryId: null,
    onStopAtmosphere: () => {},
    input: "",
    inputRef: null,
    inputProps: { value: "", onChange: () => {}, onKeyDown: () => {} },
    onSubmit: (event) => event.preventDefault(),
    onClick: () => {},
    bodyRef: null,
    bodyStyle: { minHeight: 160, maxHeight: 360 },
    fill: false,
  },
  render: (args) => (
    <div className="overflow-hidden rounded-xl bg-gray-800 shadow-md">
      <TerminalBody {...args} />
    </div>
  ),
} satisfies Meta<typeof TerminalBody>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithHistory: Story = {
  args: {
    entries: [
      { id: 0, command: "./intro.sh", result: { kind: "intro" } },
      { id: 1, command: "help", result: { kind: "help" } },
      { id: 2, command: "sl", result: { kind: "notFound", command: "sl" } },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: "A few lines in, with a command that does not exist among them.",
      },
    },
  },
};

export const SendingAMessage: Story = {
  args: {
    entries: [
      { id: 0, command: "send-message", result: { kind: "sendMessage" } },
      { id: 1, command: "Jane Doe", prompt: "name", result: { kind: "empty" } },
      {
        id: 2,
        command: "jane@example",
        prompt: "email",
        result: { kind: "message", note: { kind: "invalid", field: "email" } },
      },
      { id: 3, command: "jane@example.com", prompt: "email", result: { kind: "empty" } },
    ],
    step: "website",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Halfway through `send-message`: the answers so far sit under their questions, and the prompt asks the next one.",
      },
    },
  },
};
