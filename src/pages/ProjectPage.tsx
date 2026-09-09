import MarkdownBody from "@/components/content/MarkdownBody";
import ArrowLink from "@/components/ui/ArrowLink";
import EndNote from "@/components/ui/EndNote";
import { Subtitle, Title } from "@/components/ui/typography";
import ProjectLinks from "@/features/projects/ProjectLinks";
import RelatedPosts from "@/features/projects/RelatedPosts";
import type { ProjectContent } from "@/server/content";
import type { BlogPost } from "@/types/blog-post";

interface ProjectPageProps {
  project: ProjectContent;
  relatedPosts: BlogPost[];
}

export default function ProjectPage({ project, relatedPosts }: ProjectPageProps) {
  return (
    <article>
      <Title>{project.title}</Title>
      <Subtitle>{project.subtitle}</Subtitle>
      <ProjectLinks project={project} />
      <MarkdownBody content={project.content} />
      <RelatedPosts posts={relatedPosts} />
      <EndNote>
        <ArrowLink to="/projects" direction="back">
          Back to all projects
        </ArrowLink>
      </EndNote>
    </article>
  );
}
