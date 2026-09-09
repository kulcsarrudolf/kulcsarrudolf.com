import type { Meta, StoryObj } from "@storybook/react-vite";

import Navbar from "./Navbar";

const meta = {
  title: "Layout/Navbar/Navbar",
  component: Navbar,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "The fixed site header. Scroll the story to see it dock to the top edge, narrow the viewport for the hamburger menu, and hover the avatar for a few seconds to trigger the welcome modal.",
      },
    },
  },
  render: () => (
    <div className="p-2" style={{ minHeight: "200vh" }}>
      <div style={{ marginTop: "7rem" }} className="mx-auto max-w-5xl">
        <Navbar />
        <div className="border border-gray-300 p-4 rounded-xl shadow-md">
          <p>Page content. Scroll down to see the navbar dock to the top.</p>
        </div>
      </div>
    </div>
  ),
} satisfies Meta<typeof Navbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Mobile: Story = {
  globals: { viewport: { value: "mobile1", isRotated: false } },
};
