import type { Meta, StoryObj } from "@storybook/react-vite";

import MessageNote from "./MessageNote";

const meta = {
  title: "Terminal/MessageNote",
  component: MessageNote,
  parameters: {
    docs: {
      description: {
        component:
          "What `send-message` prints between its questions: why an answer was not taken, the message read back before it goes, and how the sending went. One story per note.",
      },
    },
  },
  args: {
    note: {
      kind: "summary",
      draft: {
        name: "Jane Doe",
        email: "jane@example.com",
        website: "https://jane.dev",
        message: "Hi Rudolf, I found your terminal and wanted to say hello.",
      },
    },
  },
  render: (args) => (
    <div className="rounded-xl bg-gray-800 p-6 font-mono text-[15px] leading-[1.6]">
      <MessageNote {...args} />
    </div>
  ),
} satisfies Meta<typeof MessageNote>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Summary: Story = {};

export const Invalid: Story = {
  args: { note: { kind: "invalid", field: "email" } },
};

export const YesNo: Story = {
  args: { note: { kind: "yesNo" } },
};

export const Sent: Story = {
  args: { note: { kind: "sent" } },
};

export const Failed: Story = {
  args: { note: { kind: "failed" } },
};

export const Discarded: Story = {
  args: { note: { kind: "discarded" } },
};

export const GaveUp: Story = {
  args: { note: { kind: "gaveUp" } },
};
