import { FEED_PATH, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/config/site";
import type { BlogPost } from "@/types/blog-post";

import { getPostMetadata } from "./content";
import { escapeXml } from "./xml";

// The RSS 2.0 feed: every published post, newest first, with its summary and
// a link back to the page. A summary rather than the full body, so a reader
// who wants the article visits the site.

// RSS dates are RFC 822. Post dates are `YYYY-MM-DD`, which Date parses as
// UTC midnight, so every post is stamped at the start of its day.
const toRfc822 = (date: string): string => new Date(date).toUTCString();

const postUrl = (post: BlogPost): string => `${SITE_URL}/posts/${post.slug}`;

const itemXml = (post: BlogPost): string =>
  [
    "    <item>",
    `      <title>${escapeXml(post.title)}</title>`,
    `      <link>${escapeXml(postUrl(post))}</link>`,
    `      <guid isPermaLink="true">${escapeXml(postUrl(post))}</guid>`,
    `      <pubDate>${toRfc822(post.date)}</pubDate>`,
    `      <description>${escapeXml(post.description || post.subtitle)}</description>`,
    `      <dc:creator>${escapeXml(post.author)}</dc:creator>`,
    `      <dc:language>${post.lang}</dc:language>`,
    ...(post.keywords ?? []).map((keyword) => `      <category>${escapeXml(keyword)}</category>`),
    "    </item>",
  ].join("\n");

export const buildRssXml = (): string => {
  const posts = [...getPostMetadata()].sort((a, b) => b.date.localeCompare(a.date));
  const newest = posts[0];

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">',
    "  <channel>",
    `    <title>${escapeXml(SITE_NAME)}</title>`,
    `    <link>${SITE_URL}</link>`,
    `    <description>${escapeXml(SITE_DESCRIPTION)}</description>`,
    "    <language>en</language>",
    ...(newest ? [`    <lastBuildDate>${toRfc822(newest.date)}</lastBuildDate>`] : []),
    `    <atom:link href="${SITE_URL}${FEED_PATH}" rel="self" type="application/rss+xml" />`,
    "    <image>",
    `      <url>${SITE_URL}/images/me-logo.png</url>`,
    `      <title>${escapeXml(SITE_NAME)}</title>`,
    `      <link>${SITE_URL}</link>`,
    "    </image>",
    ...posts.map(itemXml),
    "  </channel>",
    "</rss>",
    "",
  ].join("\n");
};
