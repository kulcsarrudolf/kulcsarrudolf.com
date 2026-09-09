import { AUTHOR_NAME, SITE_NAME, SITE_URL, SOCIAL_PROFILES } from "@/config/site";

import { getPostMetadata, getProjectMetadata } from "./content";

// The /llms.txt index: every post and project with a summary and a link to its
// markdown twin, so an agent can find the content without crawling the HTML.
export const buildLlmsTxt = (): string => {
  const posts = [...getPostMetadata()].sort((a, b) => b.date.localeCompare(a.date));

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
