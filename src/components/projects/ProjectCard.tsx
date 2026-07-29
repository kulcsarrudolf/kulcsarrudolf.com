"use client";

import NextLink from "next/link";

import { useTranslation } from "@/i18n/useTranslation";
import Project from "@/types/project.type";

type ProjectCardProps = {
  project: Project;
};

// The card links only to the project page. GitHub and npm links live there,
// so every click from this list lands on the page we want indexed.
const ProjectCard = ({ project }: ProjectCardProps) => {
  const { t } = useTranslation();
  const languageLabel = project.lang === "hu" ? "[HU]" : "";
  const href = `/projects/${project.slug}`;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <h2 className="text-lg font-semibold mb-2">
        <NextLink
          href={href}
          className="hover:underline"
          style={{ color: "#4267b2" }}
        >
          <span className="text-blue-900">{languageLabel}</span>
          {project.title}
        </NextLink>
      </h2>
      <p className="text-gray-600 text-sm leading-relaxed">
        {project.subtitle}
      </p>
      {project.tech?.length ? (
        <div className="flex flex-wrap gap-2 mt-3">
          {project.tech.map((tech) => (
            <span
              key={tech}
              className="text-xs text-gray-600 bg-gray-100 border border-gray-200 rounded-full px-2 py-0.5"
            >
              {tech}
            </span>
          ))}
        </div>
      ) : null}
      <div className="mt-4">
        <NextLink
          href={href}
          className="text-sm hover:underline"
          style={{ color: "#4267b2" }}
        >
          {t("projects.viewProject")}
        </NextLink>
      </div>
    </div>
  );
};

export default ProjectCard;
