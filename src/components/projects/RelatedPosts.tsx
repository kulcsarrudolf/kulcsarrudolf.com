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
      <ul className="flex flex-col gap-0.5">
        {relatedPosts.map((post) => (
          <li key={post.slug}>
            <NextLink
              href={`/posts/${post.slug}`}
              // Negative margin cancels the padding so the arrow sits on the
              // heading's left edge, letting the icons read as list markers
              // while the padded hit area stays comfortably large.
              className="group -ml-3 inline-flex items-start gap-2 rounded-md px-3 py-3 text-sm font-medium transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4267b2]"
              style={{ color: "#4267b2" }}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.75}
                strokeLinecap="round"
                strokeLinejoin="round"
                // mt centres the icon on the first line, so it stays put as a
                // list marker when a long title wraps on narrow screens.
                className="mt-[3px] h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-x-0.5"
              >
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
              {post.title}
            </NextLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RelatedPosts;
