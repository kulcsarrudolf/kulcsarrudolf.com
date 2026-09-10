import type { Meta, StoryObj } from "@storybook/react-vite";

import SectionStack from "./SectionStack";
import Paragraph from "./typography/Paragraph";
import Title from "./typography/Title";

const meta = {
  title: "UI/SectionStack",
  component: SectionStack,
  parameters: {
    docs: {
      description: {
        component:
          "The gap between a page's sections, once the rules between them are gone. One value for every pair, and the trailing margin of a section that ends in a paragraph is taken off so that gap does not come out wider than the others.",
      },
    },
  },
} satisfies Meta<typeof SectionStack>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <>
        <div>
          <Title>About Me</Title>
          <Paragraph>
            A section that ends in a paragraph. Its bottom margin is taken off, so the gap below it
            matches the one below the next section.
          </Paragraph>
        </div>
        <div>
          <Title>Currently Focused On</Title>
          <Paragraph>A second section.</Paragraph>
        </div>
        <div>
          <Title>Latest Blogs</Title>
          <Paragraph>And a third.</Paragraph>
        </div>
      </>
    ),
  },
};
