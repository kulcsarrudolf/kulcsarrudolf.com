import NextLink from "next/link";

import { getPostMetadata } from "@/utils/getPostMetadata";

type RelatedPostsProps = {
  slugs?: string[];
};

// Resolving through getPostMetadata means private posts drop out
// automatically, so a project can safely reference a draft article.
const RelatedPosts = ({ slugs }: RelatedPostsProps) => {
  if (!slugs?.length) {
    return null;
  }

  const posts = getPostMetadata();
  const relatedPosts = slugs
    .map((slug) => posts.find((post) => post.slug === slug))
    .filter((post) => post !== undefined);

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
        Related reading
      </h2>
      <ul className="flex flex-col gap-2">
        {relatedPosts.map((post) => (
          <li key={post.slug}>
            <NextLink
              href={`/posts/${post.slug}`}
              className="text-sm hover:underline"
              style={{ color: "#4267b2" }}
            >
              {post.title}
            </NextLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RelatedPosts;
