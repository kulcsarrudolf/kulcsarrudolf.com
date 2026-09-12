import { Link } from "@tanstack/react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faNpm } from "@fortawesome/free-brands-svg-icons";
import { faArrowRight, faGlobe } from "@fortawesome/free-solid-svg-icons";

import LanguageBadge from "@/components/content/LanguageBadge";
import { useTranslation } from "@/i18n/useTranslation";
import type { Project } from "@/types/project";

type ProjectCardProps = {
  project: Project;
};

// The card links only to the project page. GitHub and npm links live there,
// so every click from this list lands on the page we want indexed. The icons
// in the footer only advertise which of those links a project has.
const ProjectCard = ({ project }: ProjectCardProps) => {
  const { t } = useTranslation();

  const linkIcons = [
    { key: "github", icon: faGithub, label: "GitHub", has: project.github },
    { key: "npm", icon: faNpm, label: "npm", has: project.npm },
    { key: "website", icon: faGlobe, label: "Website", has: project.website },
  ].filter((link) => Boolean(link.has));

  return (
    <Link
      to="/projects/$slug"
      params={{ slug: project.slug }}
      className="group flex h-full flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-xs transition duration-200 hover:-translate-y-0.5 hover:border-brand hover:shadow-lg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 dark:border-line-dark dark:bg-card-dark dark:hover:border-brand-dark-accent dark:focus-visible:ring-brand-dark-accent dark:focus-visible:ring-offset-surface-dark"
    >
      {/* The body grows so the footer sits on the same line in every card of a row. */}
      <div className="flex-1">
        <h2 className="text-lg font-semibold leading-snug text-brand group-hover:underline dark:text-brand-dark-accent">
          <LanguageBadge lang={project.lang} />
          {project.title}
        </h2>

        <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          {project.subtitle}
        </p>

        {project.tech?.length ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {project.tech.map((tech) => (
              <span
                key={tech}
                className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-200 transition-colors group-hover:bg-brand/5 group-hover:text-brand group-hover:ring-brand/20 dark:bg-fill-dark dark:text-gray-400 dark:ring-line-dark dark:group-hover:bg-brand-dark-accent/10 dark:group-hover:text-brand-dark-accent dark:group-hover:ring-brand-dark-accent/30"
              >
                {tech}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-gray-100 pt-3 dark:border-line-dark">
        <span className="flex items-center gap-3 text-gray-400 dark:text-gray-500">
          {linkIcons.map((link) => (
            <FontAwesomeIcon
              key={link.key}
              icon={link.icon}
              title={link.label}
              className="text-base transition-colors group-hover:text-gray-600 dark:group-hover:text-gray-300"
            />
          ))}
        </span>
        <span className="flex items-center gap-1.5 text-sm font-medium text-brand dark:text-brand-dark-accent">
          {t("projects.viewProject")}
          <FontAwesomeIcon
            icon={faArrowRight}
            className="text-xs transition-transform duration-200 group-hover:translate-x-1"
          />
        </span>
      </div>
    </Link>
  );
};

export default ProjectCard;
