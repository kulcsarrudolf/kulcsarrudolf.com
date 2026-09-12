import { Link } from "@tanstack/react-router";

import LanguageBadge from "@/components/content/LanguageBadge";
import { useLangSearch } from "@/i18n/useLangSearch";
import { useTranslation } from "@/i18n/useTranslation";
import type { BlogPost } from "@/types/blog-post";

type BlogPostPreviewProps = {
  post: BlogPost;
  compact?: boolean;
};
const BlogPostPreview = ({ post, compact = false }: BlogPostPreviewProps) => {
  const { t } = useTranslation();
  const langSearch = useLangSearch();

  const linkProps = {
    to: "/posts/$slug",
    params: { slug: post.slug },
    search: langSearch,
  } as const;

  if (compact) {
    return (
      <div key={post.title} className="mb-3">
        <Link {...linkProps}>
          {/* Flex so the arrow keeps its gap and wrapped titles hang under
              the title, not under the arrow. */}
          <p className="hover:text-brand font-bold flex items-baseline gap-2 dark:hover:text-brand-dark-accent">
            <span aria-hidden="true" className="shrink-0">
              ➡️
            </span>
            <span>
              <LanguageBadge lang={post.lang} />
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
        <p className="font-bold group-hover:text-brand dark:group-hover:text-brand-dark-accent">
          <LanguageBadge lang={post.lang} />
          {post.title}
        </p>
        <p>{post.subtitle}</p>
        <p className="text-sm text-slate-400 dark:text-gray-400">
          {t("blogPost.postedOn")}: <span className="italic">{post.date}</span> |{" "}
          {t("blogPost.author")}: <span className="italic">{post.author}</span>
        </p>
      </Link>
    </div>
  );
};

export default BlogPostPreview;
