"use client";

import BlogPostListClient from "@/components/blog/BlogPostListClient";
import { useTranslation } from "@/i18n/useTranslation";
import BlogPost from "@/types/blog-post.type";

interface BlogPageProps {
  posts: BlogPost[];
}

export default function BlogPage({ posts }: BlogPageProps) {
  const { t } = useTranslation();
  return (
    <BlogPostListClient
      title={String(t("blog.title")) as string}
      posts={posts || []}
    />
  );
}
