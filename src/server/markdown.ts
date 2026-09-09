import { SITE_URL } from "@/config/site";

import { getPostContent, getProjectContent } from "./content";

// The markdown twins of the post and project pages, served to AI agents that
// ask for them (see the request middleware in src/start.ts).

export const MARKDOWN_HEADERS = {
  "Content-Type": "text/markdown; charset=utf-8",
} as const;

export const buildPostMarkdown = (slug: string): string | null => {
  const post = getPostContent(slug);

  if (!post) {
    return null;
  }

  return [
    `# ${post.title}`,
    "",
    ...(post.subtitle ? [`> ${post.subtitle}`, ""] : []),
    `By ${post.author}, published on ${post.date}.`,
    `Canonical URL: ${SITE_URL}/posts/${slug}`,
    "",
    post.content.trim(),
    "",
  ].join("\n");
};

export const buildProjectMarkdown = (slug: string): string | null => {
  const project = getProjectContent(slug);

  if (!project) {
    return null;
  }

  // The fact lines are the point of this route: they turn a prose page
  // into something an agent can read without parsing the body.
  const facts = [
    `Canonical URL: ${SITE_URL}/projects/${slug}`,
    ...(project.github ? [`GitHub: ${project.github}`] : []),
    ...(project.npm ? [`npm: ${project.npm}`] : []),
    ...(project.website ? [`Website: ${project.website}`] : []),
    ...(project.tech?.length ? [`Tech: ${project.tech.join(", ")}`] : []),
    ...(project.date ? [`Published: ${project.date}`] : []),
  ];

  return [
    `# ${project.title}`,
    "",
    ...(project.subtitle ? [`> ${project.subtitle}`, ""] : []),
    ...facts,
    "",
    project.content.trim(),
    "",
  ].join("\n");
};
