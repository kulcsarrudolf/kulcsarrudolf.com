"use client";

import { Title } from "@/components/general/typography";
import Link from "@/components/general/typography/Link";

const personalProjects = [
  {
    name: "zimme-zoom",
    description:
      "A collection of image-related React components packaged as an npm package. The main component is PhotoViewer, a lightweight React photo viewer with zoom, navigation, blurred background, and SVG overlay support.",
    repo: "https://github.com/kulcsarrudolf/zimme-zoom",
  },
  {
    name: "Samsung Device Helper",
    description:
      "A Node.js package published on npm that provides utilities and helpers for working with Samsung devices, simplifying common device management tasks.",
    secondaryDescription:
      "Also includes an AI agent that uses Playwright MCP and Claude to keep the device catalogue up to date. It reads the current year's device file from GitHub, scrapes GSM Arena for new releases, sorts them by release date, and opens a GitHub pull request automatically if the catalogue is out of date.",
    secondaryLink: {
      text: "AI agent",
      url: "https://github.com/kulcsarrudolf/samsung-device-helper-agent",
    },
    repo: "https://www.npmjs.com/package/samsung-device-helper",
  },
  {
    name: "Kőszikla APP (PWA)",
    description:
      "Web application developed for my church community to manage volunteer scheduling and coordination. The app sends SMS notifications whenever a member is assigned to a service on Sunday. It includes a feature similar to Slack Donut that helps members connect with one another each month, fostering stronger relationships within the community. In addition, Koszikla provides access to upcoming church events and related recordings. The platform currently serves around 50 members. My long-term goal is to make this app open-source so that any church can adopt and customize it for their own community. I'm also developing an AI agent that automatically generates concise summaries of sermons, identifying key topics and Bible verses to make it easier to search and explore sermons by subject or scripture reference.",
    repo: null,
  },
  {
    name: "Puncto for Video",
    description:
      "Browser-based tool for precise video timing. Mark two points and get the delta instantly, down to the millisecond. Features measurement logging, CSV export, and interval comparison. Fully client-side, so no data leaves the device.",
    repo: "https://puncto.live",
  },
  {
    name: "Puncto Timer",
    description:
      "Chrome Extension for measuring elapsed time between any two browser interactions, down to the millisecond. Works on any webpage.",
    repo: "https://puncto.live/extension/",
  },
  {
    name: "Mongoose Seed Kit",
    description:
      "A lightweight seeder toolkit for Mongoose that runs seed scripts on application startup and tracks their execution status. Supports one-time execution, automatic retries for failed seeds, a CLI for generating new seeders, and helper functions for building admin routes. Zero external dependencies.",
    repo: "https://www.npmjs.com/package/mongoose-seed-kit",
  },
];

type Project = (typeof personalProjects)[number];

function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3 mb-2">
        <h2 className="text-lg font-semibold" style={{ color: "#4267b2" }}>
          {project.name}
        </h2>
        {project.repo && <Link href={project.repo}>Visit</Link>}
      </div>
      <p className="text-gray-600 text-sm leading-relaxed">
        {project.description}
      </p>
      {"secondaryDescription" in project && project.secondaryDescription && (
        <p className="text-gray-600 text-sm leading-relaxed mt-2">
          {project.secondaryDescription}{" "}
          {"secondaryLink" in project && project.secondaryLink && (
            <Link href={project.secondaryLink.url}>
              {project.secondaryLink.text}
            </Link>
          )}
        </p>
      )}
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <>
      <Title>Projects</Title>
      <p className="text-gray-600 mb-6">
        A selection of things I&apos;ve built — side projects, open-source
        packages, and tools I use myself.
      </p>
      <div className="flex flex-col gap-4">
        {personalProjects.map((project) => (
          <ProjectCard key={project.name} project={project} />
        ))}
      </div>
      <div className="mt-8 pt-6 border-t border-gray-200 text-center">
        <p className="text-gray-600 text-sm">
          Want to see more?{" "}
          <Link href="https://github.com/kulcsarrudolf">
            Find more on my GitHub
          </Link>
        </p>
      </div>
    </>
  );
}
