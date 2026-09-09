import type { Meta, StoryObj } from "@storybook/react-vite";

import { projects } from "@/stories/fixtures";

import ProjectCard from "./ProjectCard";

const meta = {
  title: "Projects/ProjectCard",
  component: ProjectCard,
  args: {
    project: projects[0],
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 360 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ProjectCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllLinks: Story = {};

export const GithubOnly: Story = {
  args: { project: projects[1] },
};

export const NoLinksNoTech: Story = {
  args: { project: projects[2] },
};

export const Grid: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Cards in the responsive grid used on `/projects`. The footers line up because the body of each card grows to fill the row.",
      },
    },
  },
  decorators: [(Story) => <Story />],
  render: () => (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project.slug} project={project} />
      ))}
    </div>
  ),
};
