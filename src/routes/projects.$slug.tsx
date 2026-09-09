import { createFileRoute } from "@tanstack/react-router";

import ArrowLink from "@/components/general/ArrowLink";
import EndNote from "@/components/general/EndNote";

import { Subtitle, Title } from "@/components/general/typography";
import MarkdownBody from "@/components/markdown/MarkdownBody";
import ProjectLinks from "@/components/projects/ProjectLinks";
import RelatedPosts from "@/components/projects/RelatedPosts";
import { AUTHOR_NAME, SITE_URL } from "@/config/site";
import { pageHead } from "@/lib/seo";
import { fetchProject } from "@/server/functions";
import type Project from "@/types/project.type";

const describeProject = (project: Project): string => project.description || project.subtitle;

const buildStructuredData = (project: Project, url: string) => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": project.schemaType,
      name: project.title,
      description: describeProject(project),
      url,
      image: `${SITE_URL}/images/me-logo.png`,
      // The Person node is declared once in the root route.
      author: { "@id": `${SITE_URL}/#person` },
      maintainer: { "@id": `${SITE_URL}/#person` },
      ...(project.github ? { codeRepository: project.github } : {}),
      ...(project.tech?.length ? { programmingLanguage: project.tech } : {}),
      ...(project.keywords?.length ? { keywords: project.keywords.join(", ") } : {}),
      ...(project.date ? { datePublished: project.date } : {}),
      ...(project.updated || project.date ? { dateModified: project.updated || project.date } : {}),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        {
          "@type": "ListItem",
          position: 2,
          name: "Projects",
          item: `${SITE_URL}/projects`,
        },
        { "@type": "ListItem", position: 3, name: project.title, item: url },
      ],
    },
  ],
});

export const Route = createFileRoute("/projects/$slug")({
  loader: ({ params }) => fetchProject({ data: params.slug }),
  // The same URL can answer with markdown (Accept: text/markdown), so caches
  // must key on the Accept header.
  headers: () => ({ Vary: "Accept" }),
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return {};
    }

    const { project } = loaderData;
    const path = `/projects/${params.slug}`;

    return pageHead({
      title: project.title,
      description: describeProject(project),
      keywords: project.keywords?.length ? project.keywords : undefined,
      author: AUTHOR_NAME,
      path,
      locale: project.lang === "hu" ? "hu_HU" : "en_US",
      structuredData: buildStructuredData(project, `${SITE_URL}${path}`),
    });
  },
  component: ProjectPage,
});

function ProjectPage() {
  const { project, relatedPosts } = Route.useLoaderData();

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
