import { Suspense } from "react";
import type { Metadata } from "next";
import ProjectsPage from "@/pages/ProjectsPage";

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
    url: "https://kulcsarrudolf.com/projects",
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
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProjectsPage />
    </Suspense>
  );
};

export default Projects;
