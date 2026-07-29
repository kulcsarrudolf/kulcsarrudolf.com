"use client";

import { Title } from "@/components/general/typography";
import Link from "@/components/general/typography/Link";
import ProjectCard from "@/components/projects/ProjectCard";
import { useTranslation } from "@/i18n/useTranslation";
import Project from "@/types/project.type";

interface ProjectsPageProps {
  projects: Project[];
}

export default function ProjectsPage({ projects }: ProjectsPageProps) {
  const { t } = useTranslation();

  return (
    <>
      <Title>{t("projects.title")}</Title>
      <p className="text-gray-600 mb-6">{t("projects.description")}</p>
      <div className="flex flex-col gap-4">
        {(projects || []).map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
      <div className="mt-8 pt-6 border-t border-gray-200 text-center">
        <p className="text-gray-600 text-sm">
          {t("projects.moreOnGitHub", {
            githubLink: (
              <Link href="https://github.com/kulcsarrudolf">
                {t("projects.findOnGitHub")}
              </Link>
            ),
          })}
        </p>
      </div>
    </>
  );
}
