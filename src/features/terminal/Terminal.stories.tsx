import type { Meta, StoryObj } from "@storybook/react-vite";

import Terminal from "./Terminal";

const meta = {
  title: "Terminal/Terminal",
  component: Terminal,
  parameters: {
    docs: {
      description: {
        component:
          "The terminal itself: a window in which `./intro.sh` has just printed who I am and where to go next, with a working prompt underneath. Click into it and type: Return runs the line, `help` lists what works, `ls` reprints the links, `clear` empties the history, and a page name (`blog`, `projects`, `contact`) opens that page. The body keeps a minimum height after `clear`, scrolls once the history passes its maximum, and the strip along the bottom drags it taller or shorter (arrow keys work it too; a double-click hands the height back to the content). The three dots work as well: red closes the window to a button in the corner of the page, amber rolls it up to its title bar, and green lifts it off the page into a window that drags by that bar and resizes from any edge, down to a floor of 320 by 200. The copy comes from the translation files, so use the language toolbar to see the Hungarian version.",
      },
    },
  },
} satisfies Meta<typeof Terminal>;

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
      <Terminal />
    </div>
  ),
};

export const Launcher: Story = {
  args: { launcher: true },
  parameters: {
    docs: {
      description: {
        story:
          "How every page but the home page carries it: closed, as the button fixed in the bottom right corner of the viewport. Press it and the same window comes up over the page, at a size of its own rather than the page's, and green fills the screen instead of putting it back somewhere it never was.",
      },
    },
  },
};
