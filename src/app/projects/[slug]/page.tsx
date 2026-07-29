import { Metadata } from "next";
import NextLink from "next/link";
import { notFound } from "next/navigation";

import { Subtitle, Title } from "@/components/general/typography";
import MarkdownBody from "@/components/markdown/MarkdownBody";
import ProjectLinks from "@/components/projects/ProjectLinks";
import RelatedPosts from "@/components/projects/RelatedPosts";
import { AUTHOR_NAME, SITE_NAME, SITE_URL } from "@/config/site";
import Project from "@/types/project.type";
import {
  getProjectBySlug,
  getProjectContent,
  getProjectMetadata,
} from "@/utils/getProjectMetadata";

// Every project is known at build time, so an unknown slug should 404
// rather than attempt a filesystem read at request time.
export const dynamicParams = false;

export const generateStaticParams = () =>
  getProjectMetadata().map((project) => ({ slug: project.slug }));

type Params = Promise<{ slug: string }>;

const describeProject = (project: Project): string =>
  project.description || project.subtitle;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {};
  }

  const fullTitle = `${project.title} | Kulcsar Rudolf`;
  const description = describeProject(project);

  return {
    title: project.title,
    description,
    keywords: project.keywords?.length ? project.keywords : undefined,
    authors: [{ name: AUTHOR_NAME }],
    alternates: {
      canonical: `/projects/${slug}`,
    },
    openGraph: {
      type: "website",
      url: `${SITE_URL}/projects/${slug}`,
      siteName: SITE_NAME,
      locale: project.lang === "hu" ? "hu_HU" : "en_US",
      title: fullTitle,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      creator: "@kulcsarrudolf",
    },
  };
}

const buildStructuredData = (project: Project, url: string) => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": project.schemaType,
      name: project.title,
      description: describeProject(project),
      url,
      image: `${SITE_URL}/images/me-logo.png`,
      // The Person node is declared once in the root layout.
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

const ProjectPage = async ({ params }: { params: Params }) => {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  const content = getProjectContent(slug);

  if (!project || !content) {
    notFound();
  }

  const url = `${SITE_URL}/projects/${slug}`;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildStructuredData(project, url)),
        }}
      />
      <article>
        <Title>{project.title}</Title>
        <Subtitle>{project.subtitle}</Subtitle>
        <ProjectLinks project={project} />
        <div className="prose prose-sans container mx-auto max-w-none">
          <MarkdownBody content={content.content} />
        </div>
        <RelatedPosts slugs={project.relatedPosts} />
        <div className="mt-8 pt-6 border-t border-gray-200">
          <NextLink
            href="/projects"
            // Negative margin cancels the padding so the arrow sits on the
            // body text's left edge, matching the related-posts links, while
            // the padded hit area stays comfortably large.
            className="group -ml-3 inline-flex items-start gap-2 rounded-md px-3 py-3 text-sm font-medium transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4267b2]"
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
          </NextLink>
        </div>
      </article>
    </>
  );
};

export default ProjectPage;
