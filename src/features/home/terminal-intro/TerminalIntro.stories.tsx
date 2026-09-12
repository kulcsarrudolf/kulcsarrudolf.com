import type { Meta, StoryObj } from "@storybook/react-vite";

import TerminalIntro from "./TerminalIntro";

const meta = {
  title: "Home/Terminal intro/TerminalIntro",
  component: TerminalIntro,
  parameters: {
    docs: {
      description: {
        component:
          "The block that opens the home page: a terminal window in which `./intro.sh` has just printed who I am and where to go next, with a working prompt underneath. Click into it and type: Return runs the line, `help` lists what works, `ls` reprints the links, `clear` empties the history, and a page name (`blog`, `projects`, `contact`) opens that page. The body keeps a minimum height after `clear`, scrolls once the history passes its maximum, and the strip along the bottom drags it taller or shorter (arrow keys work it too; a double-click hands the height back to the content). The one dark object on the page, a counterweight to the Let's Talk band. The copy comes from the translation files, so use the language toolbar to see the Hungarian version.",
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
          "Constrained to a phone-sized width, where the intro sentence wraps and the three links fall onto their own row.",
      },
    },
  },
  render: () => (
    <div style={{ maxWidth: 342 }}>
      <TerminalIntro />
    </div>
  ),
};
