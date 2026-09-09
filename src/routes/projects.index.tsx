import { createFileRoute } from "@tanstack/react-router";

import { SITE_URL } from "@/config/site";
import { pageHead } from "@/lib/seo";
import ProjectsPage from "@/pages/ProjectsPage";
import { fetchProjects } from "@/server/functions";
import type Project from "@/types/project.type";

const PROJECTS_TITLE = "Projects";
const PROJECTS_DESCRIPTION =
  "Personal projects by Kulcsar Rudolf, including open-source npm packages, AI agents, React tooling, browser extensions, and small web apps.";
const PROJECTS_KEYWORDS = [
  "Kulcsar Rudolf projects",
  "personal projects",
  "open source",
  "npm packages",
  "ai agents",
  "react components",
  "browser extension",
  "puncto",
  "samsung-device-helper",
  "zimme-zoom",
  "mongoose-seed-kit",
  "pg-seed-kit",
  "stl-metrics",
];

const buildStructuredData = (projects: Project[]) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: PROJECTS_TITLE,
  description: PROJECTS_DESCRIPTION,
  itemListElement: projects.map((project, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: project.title,
    url: `${SITE_URL}/projects/${project.slug}`,
  })),
});

export const Route = createFileRoute("/projects/")({
  loader: () => fetchProjects(),
  head: ({ loaderData }) =>
    pageHead({
      title: PROJECTS_TITLE,
      description: PROJECTS_DESCRIPTION,
      keywords: PROJECTS_KEYWORDS,
      path: "/projects",
      structuredData: buildStructuredData(loaderData ?? []),
    }),
  component: Projects,
});

function Projects() {
  const projects = Route.useLoaderData();
  return <ProjectsPage projects={projects} />;
}
