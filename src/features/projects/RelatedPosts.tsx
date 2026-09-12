import ArrowLink from "@/components/ui/ArrowLink";
import type { BlogPost } from "@/types/blog-post";

type RelatedPostsProps = {
  posts: BlogPost[];
};

// The project loader already resolved the slugs against the published posts,
// so private posts have dropped out and every entry here is linkable.
const RelatedPosts = ({ posts }: RelatedPostsProps) => {
  if (posts.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-line-dark">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 dark:text-gray-400">
        Related reading
      </h2>
      <ul className="flex flex-col gap-0.5">
        {posts.map((post) => (
          <li key={post.slug}>
            <ArrowLink to="/posts/$slug" params={{ slug: post.slug }}>
              {post.title}
            </ArrowLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RelatedPosts;
