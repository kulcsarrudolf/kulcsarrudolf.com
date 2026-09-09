import { Link, createFileRoute } from "@tanstack/react-router";

import { Subtitle, Title } from "@/components/general/typography";
import MarkdownBody from "@/components/markdown/MarkdownBody";
import ProjectLinks from "@/components/projects/ProjectLinks";
import RelatedPosts from "@/components/projects/RelatedPosts";
import { AUTHOR_NAME, SITE_URL } from "@/config/site";
import { pageHead } from "@/lib/seo";
import { fetchProject } from "@/server/functions";
import type Project from "@/types/project.type";

const describeProject = (project: Project): string =>
  project.description || project.subtitle;

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
      ...(project.keywords?.length
        ? { keywords: project.keywords.join(", ") }
        : {}),
      ...(project.date ? { datePublished: project.date } : {}),
      ...(project.updated || project.date
        ? { dateModified: project.updated || project.date }
        : {}),
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
      <div className="prose prose-sans container mx-auto max-w-none">
        <MarkdownBody content={project.content} />
      </div>
      <RelatedPosts posts={relatedPosts} />
      <div className="mt-8 pt-6 border-t border-gray-200">
        <Link
          to="/projects"
          // Negative margin cancels the padding so the arrow sits on the
          // body text's left edge, matching the related-posts links, while
          // the padded hit area stays comfortably large.
          className="group -ml-3 inline-flex items-start gap-2 rounded-md px-3 py-3 text-sm font-medium transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          style={{ color: "#4267b2" }}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.75}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mt-[3px] h-3.5 w-3.5 shrink-0 transition-transform group-hover:-translate-x-0.5"
          >
            <path d="M13 8H3M7 4l-4 4 4 4" />
          </svg>
          Back to all projects
        </Link>
      </div>
    </article>
  );
}
