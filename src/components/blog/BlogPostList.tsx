import { getPostMetadata } from "@/utils/getPostMetadata";
import BlogPostPreview from "./BlogPostPreview";
import Title from "../general/typography/Title";

type BlogPostListProps = {
  title?: string;
  noOfElements?: number;
};
const BlogPostList = ({
  title = "Articles",
  noOfElements = 0,
}: BlogPostListProps) => {
  const posts = getPostMetadata();

  return (
    <div>
      <Title>{title}</Title>
      {posts
        .slice(0, noOfElements ? noOfElements : posts.length)
        .map((post) => (
          <BlogPostPreview key={post.slug} post={post} />
        ))}
    </div>
  );
};

export default BlogPostList;
