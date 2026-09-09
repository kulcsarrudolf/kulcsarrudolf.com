import type { Meta, StoryObj } from "@storybook/react-vite";

import ContactCallout from "./ContactCallout";
import Link from "@/components/ui/typography/Link";

const meta = {
  title: "Contact/ContactCallout",
  component: ContactCallout,
  parameters: {
    docs: {
      description: {
        component:
          "The centred line at the top of /contact, pointing at LinkedIn before the form is offered as the second way to get in touch.",
      },
    },
  },
  args: {
    children: (
      <>
        The quickest way to reach me is on{" "}
        <Link href="https://www.linkedin.com/in/kulcsarrudolf">LinkedIn</Link>.
      </>
    ),
  },
} satisfies Meta<typeof ContactCallout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
