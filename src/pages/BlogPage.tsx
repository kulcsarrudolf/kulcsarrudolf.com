import BlogPostList from "@/features/blog/BlogPostList";
import { useTranslation } from "@/i18n/useTranslation";
import type { BlogPost } from "@/types/blog-post";

interface BlogPageProps {
  posts: BlogPost[];
}

export default function BlogPage({ posts }: BlogPageProps) {
  const { t } = useTranslation();
  return <BlogPostList title={String(t("blog.title")) as string} posts={posts || []} />;
}
