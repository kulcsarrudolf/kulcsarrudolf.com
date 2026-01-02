"use client";

import Link from "next/link";
import BlogPost from "@/types/blog-post.type";
import { useTranslation } from "@/i18n/useTranslation";

type BlogPostPreviewProps = {
  post: BlogPost;
  compact?: boolean;
};
const BlogPostPreview = ({ post, compact = false }: BlogPostPreviewProps) => {
  const { t, lang } = useTranslation();
  const languageLabel = post.lang === "hu" ? "[HU]" : "";
  
  const getPostHref = () => {
    const baseHref = `/posts/${post.slug}`;
    if (lang !== "en") {
      return `${baseHref}?lang=${lang}`;
    }
    return baseHref;
  };

  if (compact) {
    return (
      <div key={post.title} className="mb-2">
        <Link href={getPostHref()}>
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
      <Link href={getPostHref()} className="group">
        <p className="font-bold group-hover:text-blue-500">
          <span className="text-blue-900">{languageLabel}</span>
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
