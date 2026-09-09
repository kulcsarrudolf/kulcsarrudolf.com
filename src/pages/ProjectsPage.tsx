import CardGrid from "@/components/ui/CardGrid";
import EndNote from "@/components/ui/EndNote";
import { Lead, Link, Note, Title } from "@/components/ui/typography";
import ProjectCard from "@/features/projects/ProjectCard";
import { useTranslation } from "@/i18n/useTranslation";
import type { Project } from "@/types/project";

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
              <Link href="https://github.com/kulcsarrudolf">{t("projects.findOnGitHub")}</Link>
            ),
          })}
        </Note>
      </EndNote>
    </>
  );
}
