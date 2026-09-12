import type { Meta, StoryObj } from "@storybook/react-vite";

import WeddingLine from "./WeddingLine";

const meta = {
  title: "Home/Terminal intro/WeddingLine",
  component: WeddingLine,
  parameters: {
    docs: {
      description: {
        component:
          "What the terminal prints for the hidden wedding command: the names, the date, and the countdown ticking once a second. The wording comes from the /nr page's own translations, so the site's language picks between Hungarian and English.",
      },
    },
  },
  render: () => (
    <div className="rounded-xl bg-gray-800 p-6 font-mono text-[15px] leading-[1.6]">
      <WeddingLine />
    </div>
  ),
} satisfies Meta<typeof WeddingLine>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
