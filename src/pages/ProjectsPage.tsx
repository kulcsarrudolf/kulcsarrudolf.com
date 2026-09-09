import CardGrid from "@/components/general/CardGrid";
import EndNote from "@/components/general/EndNote";
import { Lead, Note, Title } from "@/components/general/typography";
import Link from "@/components/general/typography/Link";
import ProjectCard from "@/components/projects/ProjectCard";
import { useTranslation } from "@/i18n/useTranslation";
import type Project from "@/types/project.type";

interface ProjectsPageProps {
  projects: Project[];
}

export default function ProjectsPage({ projects }: ProjectsPageProps) {
  const { t } = useTranslation();

  return (
    <>
      <Title>{t("projects.title")}</Title>
      <Lead>{t("projects.description")}</Lead>
      <CardGrid>
        {(projects || []).map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </CardGrid>
      <EndNote centered>
        <Note>
          {t("projects.moreOnGitHub", {
            githubLink: (
              <Link href="https://github.com/kulcsarrudolf">
                {t("projects.findOnGitHub")}
              </Link>
            ),
          })}
        </Note>
      </EndNote>
    </>
  );
}
