import { Link } from "@tanstack/react-router";
import type BlogPost from "@/types/blog-post.type";
import { useTranslation } from "@/i18n/useTranslation";

type BlogPostPreviewProps = {
  post: BlogPost;
  compact?: boolean;
};
const BlogPostPreview = ({ post, compact = false }: BlogPostPreviewProps) => {
  const { t, lang } = useTranslation();
  // Null rather than an empty span, so the trailing margin only exists
  // when there is a badge to separate from the title.
  const languageBadge =
    post.lang === "hu" ? (
      <span className="text-blue-900 mr-1">[HU]</span>
    ) : null;

  // Keep the chosen language across navigation; undefined drops the param.
  const linkProps = {
    to: "/posts/$slug",
    params: { slug: post.slug },
    search: { lang: lang !== "en" ? lang : undefined },
  } as const;

  if (compact) {
    return (
      <div key={post.title} className="mb-3">
        <Link {...linkProps}>
          {/* Flex so the arrow keeps its gap and wrapped titles hang under
              the title, not under the arrow. */}
          <p className="hover:text-blue-500 font-bold flex items-baseline gap-2">
            <span aria-hidden="true" className="shrink-0">
              ➡️
            </span>
            <span>
              {languageBadge}
              {post.title}
            </span>
          </p>
        </Link>
      </div>
    );
  }

  return (
    <div key={post.title} className="mb-2">
      <Link {...linkProps} className="group">
        <p className="font-bold group-hover:text-blue-500">
          {languageBadge}
          {post.title}
        </p>
        <p>{post.subtitle}</p>
        <p className="text-sm text-slate-400">
          {t("blogPost.postedOn")}: <span className="italic">{post.date}</span> | {t("blogPost.author")}:{" "}
          <span className="italic">{post.author}</span>
        </p>
      </Link>
    </div>
  );
};

export default BlogPostPreview;
