import { Metadata } from "next";
import BlogPostList from "@/components/blog/BlogPostList";

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
  return <BlogPostList title="My Blog" />;
};

export default Blog;
