import { createFileRoute } from "@tanstack/react-router";

import { pageHead } from "@/lib/seo";
import BlogPage from "@/pages/BlogPage";
import { fetchPosts } from "@/server/functions";

const BLOG_TITLE = "Blog";
const BLOG_DESCRIPTION =
  "Articles by Kulcsar Rudolf about software development, AI agents, web engineering, and career growth. Practical notes from a full-stack developer.";
const BLOG_KEYWORDS = [
  "software development blog",
  "programming articles",
  "ai agents",
  "web development",
  "software engineering",
  "coding tips",
  "developer blog",
  "tech insights",
  "Kulcsar Rudolf",
];

export const Route = createFileRoute("/blog")({
  loader: () => fetchPosts(),
  head: () =>
    pageHead({
      title: BLOG_TITLE,
      description: BLOG_DESCRIPTION,
      keywords: BLOG_KEYWORDS,
      path: "/blog",
    }),
  component: Blog,
});

function Blog() {
  const posts = Route.useLoaderData();
  return <BlogPage posts={posts} />;
}
