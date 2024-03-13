import Link from "next/link";
import BlogPost from "@/types/blog-post.type";

type BlogPostPreviewProps = {
  post: BlogPost;
  compact?: boolean;
};
const BlogPostPreview = ({ post, compact = false }: BlogPostPreviewProps) => {
  const languageLabel = post.lang === "hu" ? "[HU]" : "";

  if (compact) {
    return (
      <div key={post.title} className="mb-2">
        <Link href={`/posts/${post.slug}`}>
          <p className="hover:text-blue-500 font-bold">
            ➡️<span className="text-blue-900">{languageLabel}</span>
            {post.title}
          </p>
        </Link>
      </div>
    );
  }

  return (
    <div key={post.title} className="mb-2">
      <Link href={`/posts/${post.slug}`} className="group">
        <p className="font-bold group-hover:text-blue-500">
          <span className="text-blue-900">{languageLabel}</span>
          {post.title}
        </p>
        <p>{post.subtitle}</p>
        <p className="text-sm text-slate-400">
          Posted On: <span className="italic">{post.date}</span> | Author:{" "}
          <span className="italic">{post.author}</span>
        </p>
      </Link>
    </div>
  );
};

export default BlogPostPreview;
