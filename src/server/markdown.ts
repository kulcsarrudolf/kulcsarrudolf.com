import {
  AUTHOR_NAME,
  SITE_NAME,
  SITE_URL,
  SOCIAL_PROFILES,
} from "@/config/site";

import {
  getPostContent,
  getPostMetadata,
  getProjectContent,
  getProjectMetadata,
} from "./content";

// Plain-text responses for AI agents and crawlers: the markdown twins of the
// post and project pages, the llms.txt index, and the XML sitemap.

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

export const buildLlmsTxt = (): string => {
  const posts = [...getPostMetadata()].sort((a, b) =>
    b.date.localeCompare(a.date)
  );

  const postLines = posts.map((post) => {
    const summary = post.description || post.subtitle;
    return `- [${post.title}](${SITE_URL}/posts/${post.slug}.md): ${summary}`;
  });

  const projectLines = getProjectMetadata().map((project) => {
    const summary = project.description || project.subtitle;
    return `- [${project.title}](${SITE_URL}/projects/${project.slug}.md): ${summary}`;
  });

  return [
    `# ${SITE_NAME}`,
    "",
    `> Personal website and blog of ${AUTHOR_NAME}, a full-stack software engineer. Articles about software development, side projects, and the tools and ideas he works with every day.`,
    "",
    "Every blog post and project page is available as clean markdown: append `.md` to the URL, or request the URL with an `Accept: text/markdown` header.",
    "",
    "## Blog",
    "",
    ...postLines,
    "",
    "## Projects",
    "",
    ...projectLines,
    "",
    "## Pages",
    "",
    `- [Home](${SITE_URL}/): Introduction and overview`,
    `- [Blog](${SITE_URL}/blog): All blog posts`,
    `- [Projects](${SITE_URL}/projects): Side projects and open source work`,
    `- [Contact](${SITE_URL}/contact): How to get in touch`,
    "",
    "## Social",
    "",
    ...SOCIAL_PROFILES.map((url) => `- ${url}`),
    "",
  ].join("\n");
};

type SitemapEntry = { url: string; lastModified?: string };

const escapeXml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

// `date` is optional on projects, so only send lastmod when we actually have
// a valid one. An Invalid Date would break the generated XML.
const toLastModified = (value?: string): string | undefined => {
  if (!value) {
    return undefined;
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
};

export const buildSitemapXml = (): string => {
  const pages: SitemapEntry[] = [
    "",
    "/blog",
    "/projects",
    "/quotes",
    "/contact",
  ].map((path) => ({ url: `${SITE_URL}${path}` }));

  const posts: SitemapEntry[] = getPostMetadata().map((post) => ({
    url: `${SITE_URL}/posts/${post.slug}`,
    lastModified: toLastModified(post.date),
  }));

  const projects: SitemapEntry[] = getProjectMetadata().map((project) => ({
    url: `${SITE_URL}/projects/${project.slug}`,
    lastModified: toLastModified(project.updated || project.date),
  }));

  const entries = [...pages, ...posts, ...projects].map((entry) =>
    [
      "  <url>",
      `    <loc>${escapeXml(entry.url)}</loc>`,
      ...(entry.lastModified
        ? [`    <lastmod>${entry.lastModified}</lastmod>`]
        : []),
      "  </url>",
    ].join("\n")
  );

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries,
    "</urlset>",
    "",
  ].join("\n");
};
