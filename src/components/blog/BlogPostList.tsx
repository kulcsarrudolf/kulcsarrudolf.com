import { getPostMetadata } from "@/utils/getPostMetadata";
import BlogPostPreview from "./BlogPostPreview";

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
      <h1 className="text-2xl font-bold mb-4">{title}</h1>
      {posts
        .slice(0, noOfElements ? noOfElements : posts.length)
        .map((post) => (
          <BlogPostPreview key={post.slug} post={post} />
        ))}
    </div>
  );
};

export default BlogPostList;
