import { Link } from "@tanstack/react-router";

import type BlogPost from "@/types/blog-post.type";

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
    <div className="mt-8 pt-6 border-t border-gray-200">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
        Related reading
      </h2>
      <ul className="flex flex-col gap-0.5">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              to="/posts/$slug"
              params={{ slug: post.slug }}
              // Negative margin cancels the padding so the arrow sits on the
              // heading's left edge, letting the icons read as list markers
              // while the padded hit area stays comfortably large.
              className="group -ml-3 inline-flex items-start gap-2 rounded-md px-3 py-3 text-sm font-medium transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
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
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RelatedPosts;
