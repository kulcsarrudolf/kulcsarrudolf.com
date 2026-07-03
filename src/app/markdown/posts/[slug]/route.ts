import fs from "fs";

import matter from "gray-matter";

import { getPostMetadata } from "@/utils/getPostMetadata";
import { SITE_URL } from "@/config/site";

export const dynamic = "force-static";

export const generateStaticParams = () => {
  return getPostMetadata().map((post) => ({ slug: post.slug }));
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  // Only slugs of published posts are served; this also rejects
  // private posts and any path-traversal attempts.
  const post = getPostMetadata().find((p) => p.slug === slug);

  if (!post) {
    return new Response("Not found", { status: 404 });
  }

  const file = fs.readFileSync(`./src/posts/${slug}.md`, "utf8");
  const { data, content } = matter(file);

  const body = [
    `# ${data.title}`,
    "",
    ...(data.subtitle ? [`> ${data.subtitle}`, ""] : []),
    `By ${data.author}, published on ${data.date}.`,
    `Canonical URL: ${SITE_URL}/posts/${slug}`,
    "",
    content.trim(),
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
}
