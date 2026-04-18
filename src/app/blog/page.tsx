import { Metadata } from "next";
import { Suspense } from "react";
import { getPostMetadata } from "@/utils/getPostMetadata";
import BlogPage from "@/pages/BlogPage";

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

export const metadata: Metadata = {
  title: BLOG_TITLE,
  description: BLOG_DESCRIPTION,
  keywords: BLOG_KEYWORDS,
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    type: "website",
    url: "https://kulcsarrudolf.com/blog",
    title: `${BLOG_TITLE} | Kulcsar Rudolf`,
    description: BLOG_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${BLOG_TITLE} | Kulcsar Rudolf`,
    description: BLOG_DESCRIPTION,
  },
};

const Blog = () => {
  const posts = getPostMetadata();
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BlogPage posts={posts} />
    </Suspense>
  );
};

export default Blog;
