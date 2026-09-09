import type { Meta, StoryObj } from "@storybook/react-vite";

import FormField from "./FormField";

const meta = {
  title: "Contact/FormField",
  component: FormField,
  args: {
    id: "name",
    label: "Name",
    placeholder: "Your name",
    required: true,
  },
  parameters: {
    docs: {
      description: {
        component:
          "A labelled input on the contact form. The `id` doubles as the control's `name`, so the submitted payload keys match the labels.",
      },
    },
  },
  render: (args) => (
    <div style={{ maxWidth: 360 }}>
      <FormField {...args} />
    </div>
  ),
} satisfies Meta<typeof FormField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Email: Story = {
  args: {
    id: "email",
    type: "email",
    label: "Email",
    placeholder: "you@example.com",
  },
};

export const Optional: Story = {
  args: {
    id: "website",
    label: "Website",
    optionalNote: "optional",
    required: false,
    placeholder: "yoursite.com",
  },
};
