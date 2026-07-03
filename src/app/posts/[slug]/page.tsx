import fs from "fs";

import matter from "gray-matter";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import PostBody from "@/components/blog/PostBody";
import { Title, Subtitle } from "@/components/general/typography";

import { getPostMetadata, shouldShowPrivatePosts } from "@/utils/getPostMetadata";
import PostedOn from "@/components/general/PostedOn";

const getPostContent = (slug: string) => {
  const folder = "./src/posts";
  const file = `${folder}/${slug}.md`;
  const content = fs.readFileSync(file, "utf8");
  const matterResult = matter(content);

  return matterResult;
};

export const generateStaticParams = () => {
  const posts = getPostMetadata();

  return posts.map((post) => {
    return { slug: post.slug };
  });
};

type Params = Promise<{ slug: string }>;

const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "https://kulcsarrudolf.com";
};

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostContent(slug);
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/posts/${slug}`;

  const title = post.data.title;
  const fullTitle = `${title} | Kulcsar Rudolf`;
  const description =
    post.data.description ||
    post.data.subtitle ||
    `Read ${post.data.title} by ${post.data.author} on Kulcsar Rudolf's blog.`;
  const keywords = post.data.keywords
    ? Array.isArray(post.data.keywords)
      ? post.data.keywords
      : post.data.keywords.split(",").map((k: string) => k.trim())
    : [];

  return {
    title,
    description,
    keywords: keywords.length > 0 ? keywords : undefined,
    authors: [{ name: post.data.author }],
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: "Kulcsar Rudolf - Software Developer",
      locale: post.data.lang || "en_US",
      type: "article",
      publishedTime: post.data.date,
      authors: [post.data.author],
      tags: keywords.length > 0 ? keywords : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      creator: "@kulcsarrudolf",
    },
    alternates: {
      canonical: url,
    },
  };
}

const PostPage = async ({ params }: { params: Params }) => {
  const { slug } = await params;
  const post = getPostContent(slug);

  if (post.data.private === true && !shouldShowPrivatePosts()) {
    notFound();
  }

  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/posts/${slug}`;
  const description =
    post.data.description ||
    post.data.subtitle ||
    `Read ${post.data.title} by ${post.data.author} on Kulcsar Rudolf's blog.`;

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.data.title,
    description: description,
    image: `${baseUrl}/images/me-logo.png`,
    datePublished: post.data.date,
    dateModified: post.data.date,
    author: {
      "@type": "Person",
      name: post.data.author,
      url: baseUrl,
    },
    publisher: {
      "@type": "Person",
      name: post.data.author,
      url: baseUrl,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    keywords: post.data.keywords
      ? Array.isArray(post.data.keywords)
        ? post.data.keywords.join(", ")
        : post.data.keywords
      : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <article itemScope itemType="https://schema.org/BlogPosting">
        <Title itemProp="headline">{post.data.title}</Title>
        <Subtitle itemProp="description">{post.data.subtitle}</Subtitle>
        <Suspense fallback={<p className="text-sm">Loading...</p>}>
          <PostedOn date={post.data.date} />
        </Suspense>
        <div
          className="prose prose-sans container mx-auto max-w-none"
          itemProp="articleBody"
        >
          <PostBody content={post.content} />
        </div>
      </article>
    </>
  );
};

export default PostPage;
