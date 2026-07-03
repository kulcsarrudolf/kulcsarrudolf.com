import { getPostMetadata } from "@/utils/getPostMetadata";
import { AUTHOR_NAME, SITE_NAME, SITE_URL, SOCIAL_PROFILES } from "@/config/site";

export const dynamic = "force-static";

export function GET() {
  const posts = [...getPostMetadata()].sort((a, b) =>
    b.date.localeCompare(a.date)
  );

  const postLines = posts.map((post) => {
    const summary = post.description || post.subtitle;
    return `- [${post.title}](${SITE_URL}/posts/${post.slug}.md): ${summary}`;
  });

  const body = [
    `# ${SITE_NAME}`,
    "",
    `> Personal website and blog of ${AUTHOR_NAME}, a full-stack software developer. Articles about software development, side projects, and the tools and ideas he works with every day.`,
    "",
    "Every blog post is available as clean markdown: append `.md` to the post URL, or request the post URL with an `Accept: text/markdown` header.",
    "",
    "## Blog",
    "",
    ...postLines,
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

  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
}
