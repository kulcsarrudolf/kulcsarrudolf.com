import type { Meta, StoryObj } from "@storybook/react-vite";

import { projects } from "@/test/fixtures";

import ProjectLinks from "./ProjectLinks";

const meta = {
  title: "Projects/ProjectLinks",
  component: ProjectLinks,
  args: {
    project: projects[0],
  },
} satisfies Meta<typeof ProjectLinks>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllLinks: Story = {};

export const GithubAndTech: Story = {
  args: { project: projects[1] },
};

export const Nothing: Story = {
  parameters: {
    docs: {
      description: {
        story: "A project with no links and no tech list renders nothing at all.",
      },
    },
  },
  args: { project: projects[2] },
};
