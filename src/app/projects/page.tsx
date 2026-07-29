import { Suspense } from "react";
import type { Metadata } from "next";

import ProjectsPage from "@/pages/ProjectsPage";
import { SITE_URL } from "@/config/site";
import { getProjectMetadata } from "@/utils/getProjectMetadata";

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

export const metadata: Metadata = {
  title: PROJECTS_TITLE,
  description: PROJECTS_DESCRIPTION,
  keywords: PROJECTS_KEYWORDS,
  alternates: {
    canonical: "/projects",
  },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/projects`,
    title: `${PROJECTS_TITLE} | Kulcsar Rudolf`,
    description: PROJECTS_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${PROJECTS_TITLE} | Kulcsar Rudolf`,
    description: PROJECTS_DESCRIPTION,
  },
};

const Projects = () => {
  const projects = getProjectMetadata();

  // Built on the server, so the list costs nothing on the client.
  const structuredData = {
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
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Suspense fallback={<div>Loading...</div>}>
        <ProjectsPage projects={projects} />
      </Suspense>
    </>
  );
};

export default Projects;
