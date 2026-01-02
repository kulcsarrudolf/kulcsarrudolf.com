"use client";

import BlogPostPreview from "./BlogPostPreview";
import Title from "../general/typography/Title";
import BlogPost from "@/types/blog-post.type";
import { Fragment } from "react";

interface BlogPostListClientProps {
  title: string;
  posts: BlogPost[];
  noOfElements?: number;
  compact?: boolean;
}

const BlogPostListClient = ({
  title,
  posts,
  noOfElements = 0,
  compact = false,
}: BlogPostListClientProps) => {
  const numberOfPostsDisplayed = noOfElements ? noOfElements : posts.length;

  return (
    <div>
      <Title mb={!compact ? 2 : 1}>{title}</Title>
      {posts
        .sort((a, b) => {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          return dateB - dateA; // Sort descending (newest first)
        })
        .slice(0, numberOfPostsDisplayed)
        .map((post: BlogPost, idx: number) => (
          <Fragment key={`${post.slug}-${idx}-blog-post-list`}>
            <BlogPostPreview key={post.slug} post={post} compact={compact} />
            {!compact && idx < numberOfPostsDisplayed - 1 && (
              <hr className="h-px my-3" />
            )}
          </Fragment>
        ))}
    </div>
  );
};

export default BlogPostListClient;

