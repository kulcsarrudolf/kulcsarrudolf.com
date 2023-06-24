import { getPostMetadata } from "@/utils/getPostMetadata";
import BlogPostPreview from "./BlogPostPreview";

const BlogPostList = () => {
  const posts = getPostMetadata();

  return (
    <div>
      <h1>Blogs</h1>
      {posts.map((post) => (
        <BlogPostPreview key={post.slug} post={post} />
      ))}
    </div>
  );
};

export default BlogPostList;
