import { getPostMetadata } from "@/utils/getPostMetadata";
import BlogPostPreview from "./BlogPostPreview";
import Title from "../general/typography/Title";

type BlogPostListProps = {
  title?: string;
  noOfElements?: number;
  compact?: boolean;
};
const BlogPostList = ({
  title = "Articles",
  noOfElements = 0,
  compact = false,
}: BlogPostListProps) => {
  const posts = getPostMetadata();

  const numberOfPostsDisplayed = noOfElements ? noOfElements : posts.length;

  return (
    <div>
      <Title mb={!compact ? 2 : 1}>{title}</Title>
      {posts
        .slice(0, numberOfPostsDisplayed)
        .sort((a, b) => (a.date > b.date ? -1 : 1))
        .map((post, idx) => (
          <>
            <BlogPostPreview key={post.slug} post={post} compact={compact} />
            {!compact && idx < numberOfPostsDisplayed - 1 && (
              <hr className="h-px my-3" />
            )}
          </>
        ))}
    </div>
  );
};

export default BlogPostList;
