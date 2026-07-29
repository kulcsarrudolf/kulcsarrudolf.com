"use client";

import Link from "@/components/general/typography/Link";
import Project from "@/types/project.type";

type ProjectLinksProps = {
  project: Project;
};

// Renders whichever of the three outbound links a project actually has.
// Returns null when it has none, so apps without a public URL stay clean.
const ProjectLinks = ({ project }: ProjectLinksProps) => {
  const links = [
    { label: "GitHub", href: project.github },
    { label: "npm", href: project.npm },
    { label: "Website", href: project.website },
  ].filter((link) => Boolean(link.href));

  if (links.length === 0 && !project.tech?.length) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-6">
      {links.map((link) => (
        <Link key={link.label} href={link.href as string}>
          {link.label}
        </Link>
      ))}
      {project.tech?.map((tech) => (
        <span
          key={tech}
          className="text-xs text-gray-600 bg-gray-100 border border-gray-200 rounded-full px-2 py-0.5"
        >
          {tech}
        </span>
      ))}
    </div>
  );
};

export default ProjectLinks;
