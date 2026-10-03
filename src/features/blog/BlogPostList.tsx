import BlogPostPreview from "./BlogPostPreview";
import Title from "@/components/ui/typography/Title";
import type { BlogPost } from "@/types/blog-post";
import { Fragment } from "react";

interface BlogPostListProps {
  title: string;
  posts: BlogPost[];
  noOfElements?: number;
  compact?: boolean;
}

const BlogPostList = ({ title, posts, noOfElements = 0, compact = false }: BlogPostListProps) => {
  const safePosts = posts || [];
  const numberOfPostsDisplayed = noOfElements ? noOfElements : safePosts.length;

  return (
    <div>
      {/* Compact, the list is a section of another page, so it takes an h2. */}
      <Title as={compact ? "h2" : "h1"} mb={!compact ? 2 : 1}>
        {title}
      </Title>
      {safePosts
        .sort((a, b) => {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          return dateB - dateA; // Sort descending (newest first)
        })
        .slice(0, numberOfPostsDisplayed)
        .map((post: BlogPost, idx: number) => (
          <Fragment key={`${post.slug}-${idx}-blog-post-list`}>
            <BlogPostPreview key={post.slug} post={post} compact={compact} />
            {!compact && idx < numberOfPostsDisplayed - 1 && <hr className="h-px my-3" />}
          </Fragment>
        ))}
    </div>
  );
};

export default BlogPostList;
