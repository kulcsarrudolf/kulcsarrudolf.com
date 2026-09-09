import { createFileRoute } from "@tanstack/react-router";

import PostedOn from "@/components/general/PostedOn";
import { Subtitle, Title } from "@/components/general/typography";
import MarkdownBody from "@/components/markdown/MarkdownBody";
import { SITE_NAME, SITE_URL } from "@/config/site";
import { pageHead } from "@/lib/seo";
import { fetchPost } from "@/server/functions";
import type BlogPost from "@/types/blog-post.type";

const describePost = (post: BlogPost): string =>
  post.description ||
  post.subtitle ||
  `Read ${post.title} by ${post.author} on Kulcsar Rudolf's blog.`;

const buildStructuredData = (post: BlogPost, url: string) => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: post.title,
  description: describePost(post),
  image: `${SITE_URL}/images/me-logo.png`,
  datePublished: post.date,
  dateModified: post.date,
  author: {
    "@type": "Person",
    name: post.author,
    url: SITE_URL,
  },
  publisher: {
    "@type": "Person",
    name: post.author,
    url: SITE_URL,
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": url,
  },
  keywords: post.keywords?.length ? post.keywords.join(", ") : undefined,
});

export const Route = createFileRoute("/posts/$slug")({
  loader: ({ params }) => fetchPost({ data: params.slug }),
  // The same URL can answer with markdown (Accept: text/markdown), so caches
  // must key on the Accept header.
  headers: () => ({ Vary: "Accept" }),
  head: ({ loaderData: post, params }) => {
    if (!post) {
      return {};
    }

    const path = `/posts/${params.slug}`;

    return {
      ...pageHead({
        title: post.title,
        description: describePost(post),
        keywords: post.keywords?.length ? post.keywords : undefined,
        author: post.author,
        path,
        type: "article",
        locale: post.lang === "hu" ? "hu_HU" : "en_US",
        article: {
          publishedTime: post.date,
          authors: [post.author],
          tags: post.keywords,
        },
        structuredData: buildStructuredData(post, `${SITE_URL}${path}`),
      }),
    };
  },
  component: PostPage,
});

function PostPage() {
  const post = Route.useLoaderData();

  return (
    <article itemScope itemType="https://schema.org/BlogPosting">
      <meta itemProp="publisher" content={SITE_NAME} />
      <Title itemProp="headline">{post.title}</Title>
      <Subtitle itemProp="description">{post.subtitle}</Subtitle>
      <PostedOn date={post.date} />
      <MarkdownBody content={post.content} itemProp="articleBody" />
    </article>
  );
}
