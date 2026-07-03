import Link from "next/link";

import { getPostMetadata } from "@/utils/getPostMetadata";

const ACCENT_COLOR = "#4267b2";

const NotFound = () => {
  const recentPosts = [...getPostMetadata()]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3);

  return (
    <div className="flex flex-col items-center py-12 px-4 text-center">
      <p
        className="text-8xl font-bold tracking-tight"
        style={{ color: ACCENT_COLOR, opacity: 0.15 }}
        aria-hidden="true"
      >
        404
      </p>

      <h1
        className="text-2xl font-bold mt-2 mb-3"
        style={{ color: ACCENT_COLOR }}
      >
        This page could not be found
      </h1>

      <p className="text-gray-600 max-w-md mb-8" style={{ lineHeight: "2rem" }}>
        The address may be mistyped, or the page may have been moved or
        removed. Let&apos;s get you back on track.
      </p>

      <div className="mb-12">
        <Link
          href="/"
          className="font-medium hover:underline"
          style={{ color: ACCENT_COLOR }}
        >
          &larr; Back to home
        </Link>
      </div>

      {recentPosts.length > 0 && (
        <div className="w-full max-w-md text-left">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3">
            Or read something recent
          </h2>
          <ul className="divide-y divide-gray-200 border border-gray-200 rounded-lg">
            {recentPosts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/posts/${post.slug}`}
                  className="block px-4 py-3 transition-colors hover:bg-gray-50"
                >
                  <span
                    className="block font-medium"
                    style={{ color: ACCENT_COLOR }}
                  >
                    {post.title}
                  </span>
                  <span className="block text-sm text-gray-500 mt-0.5">
                    {post.subtitle}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotFound;
