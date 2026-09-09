import type { Meta, StoryObj } from "@storybook/react-vite";

import ContactForm from "./ContactForm";

const meta = {
  title: "Contact/ContactForm",
  component: ContactForm,
  parameters: {
    docs: {
      description: {
        component:
          "The contact form posts to Web3Forms using `VITE_WEB3FORMS_ACCESS_KEY`. Storybook does not load `.env.local`, so submitting here shows the error state without sending anything.",
      },
    },
  },
} satisfies Meta<typeof ContactForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Mobile: Story = {
  globals: { viewport: { value: "mobile1", isRotated: false } },
};
