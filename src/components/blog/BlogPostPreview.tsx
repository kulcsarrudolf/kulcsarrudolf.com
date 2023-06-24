import Link from "next/link";

const BlogPostPreview = ({ post }: any) => {
  return (
    <div key={post.title} className="mb-2">
      <Link href={`/posts/${post.slug}`}>
        <p>➡️{post.title}</p>
      </Link>
    </div>
  );
};

export default BlogPostPreview;
