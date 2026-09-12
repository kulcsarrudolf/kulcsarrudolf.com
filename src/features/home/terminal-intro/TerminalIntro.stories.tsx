import type { Meta, StoryObj } from "@storybook/react-vite";

import TerminalIntro from "./TerminalIntro";

const meta = {
  title: "Home/Terminal intro/TerminalIntro",
  component: TerminalIntro,
  parameters: {
    docs: {
      description: {
        component:
          "The block that opens the home page: a terminal window in which `./intro.sh` has just printed who I am and where to go next, with the cursor blinking on the prompt below. The one dark object on the page, a counterweight to the Let's Talk band. The copy comes from the translation files, so use the language toolbar to see the Hungarian version.",
      },
    },
  },
} satisfies Meta<typeof TerminalIntro>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Narrow: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Constrained to a phone-sized width, where the intro sentence wraps and the three links fall onto their own rows.",
      },
    },
  },
  render: () => (
    <div style={{ maxWidth: 342 }}>
      <TerminalIntro />
    </div>
  ),
};
