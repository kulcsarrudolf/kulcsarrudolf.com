"use client";

import NextLink from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faNpm } from "@fortawesome/free-brands-svg-icons";
import { faArrowRight, faGlobe } from "@fortawesome/free-solid-svg-icons";

import { useTranslation } from "@/i18n/useTranslation";
import Project from "@/types/project.type";

type ProjectCardProps = {
  project: Project;
};

// The card links only to the project page. GitHub and npm links live there,
// so every click from this list lands on the page we want indexed. The icons
// in the footer only advertise which of those links a project has.
const ProjectCard = ({ project }: ProjectCardProps) => {
  const { t } = useTranslation();
  const languageLabel = project.lang === "hu" ? "[HU]" : "";
  const href = `/projects/${project.slug}`;

  const linkIcons = [
    { key: "github", icon: faGithub, label: "GitHub", has: project.github },
    { key: "npm", icon: faNpm, label: "npm", has: project.npm },
    { key: "website", icon: faGlobe, label: "Website", has: project.website },
  ].filter((link) => Boolean(link.has));

  return (
    <NextLink
      href={href}
      className="group flex h-full flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-400 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
    >
      {/* The body grows so the footer sits on the same line in every card of a row. */}
      <div className="flex-1">
        <h2
          className="text-lg font-semibold leading-snug group-hover:underline"
          style={{ color: "#4267b2" }}
        >
          <span className="text-blue-900">{languageLabel}</span>
          {project.title}
        </h2>

        <p className="mt-2 text-sm leading-relaxed text-gray-600">
          {project.subtitle}
        </p>

        {project.tech?.length ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {project.tech.map((tech) => (
              <span
                key={tech}
                className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-200 transition-colors group-hover:bg-blue-50 group-hover:text-blue-700 group-hover:ring-blue-200"
              >
                {tech}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-gray-100 pt-3">
        <span className="flex items-center gap-3 text-gray-400">
          {linkIcons.map((link) => (
            <FontAwesomeIcon
              key={link.key}
              icon={link.icon}
              title={link.label}
              className="text-base transition-colors group-hover:text-gray-600"
            />
          ))}
        </span>
        <span
          className="flex items-center gap-1.5 text-sm font-medium"
          style={{ color: "#4267b2" }}
        >
          {t("projects.viewProject")}
          <FontAwesomeIcon
            icon={faArrowRight}
            className="text-xs transition-transform duration-200 group-hover:translate-x-1"
          />
        </span>
      </div>
    </NextLink>
  );
};

export default ProjectCard;
