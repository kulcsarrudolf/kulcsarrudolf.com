import { Metadata } from "next";
import { Suspense } from "react";
import { getPostMetadata } from "@/utils/getPostMetadata";
import BlogPage from "@/pages/BlogPage";

export const metadata: Metadata = {
  title: "Blog | Kulcsar Rudolf - Software Developer",
  description:
    "Explore articles about software development, technology, programming, and career growth. Read insights, experiences, and learnings from a passionate software developer.",
  keywords: [
    "software development blog",
    "programming articles",
    "technology blog",
    "web development",
    "software engineering",
    "coding tips",
    "developer blog",
    "tech insights",
  ],
  openGraph: {
    title: "Blog | Kulcsar Rudolf - Software Developer",
    description:
      "Explore articles about software development, technology, programming, and career growth.",
    url: "https://kulcsarrudolf.com/blog",
    siteName: "Kulcsar Rudolf - Software Developer",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Kulcsar Rudolf - Software Developer",
    description:
      "Explore articles about software development, technology, programming, and career growth.",
  },
  alternates: {
    canonical: "https://kulcsarrudolf.com/blog",
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
