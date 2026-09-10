import { expect, it } from "vitest";

import { FEED_PATH, SITE_URL } from "@/config/site";

import { getPostMetadata } from "./content";
import { buildRssXml } from "./rss";

it("lists every post, newest first", () => {
  const xml = buildRssXml();
  const posts = [...getPostMetadata()].sort((a, b) => b.date.localeCompare(a.date));

  expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"')).toBe(true);
  expect(xml.match(/<item>/g)).toHaveLength(posts.length);

  const links = [
    ...xml.matchAll(/<item>\n\s+<title>[^<]*<\/title>\n\s+<link>([^<]+)<\/link>/g),
  ].map((match) => match[1]);
  expect(links).toEqual(posts.map((post) => `${SITE_URL}/posts/${post.slug}`));
});

it("stamps every post with an RFC 822 date and the feed with the newest one", () => {
  const xml = buildRssXml();
  const dates = xml.match(/<pubDate>[^<]*<\/pubDate>/g) ?? [];

  expect(dates).toHaveLength(getPostMetadata().length);
  for (const tag of dates) {
    expect(tag).toMatch(
      /<pubDate>[A-Z][a-z]{2}, \d{2} [A-Z][a-z]{2} \d{4} 00:00:00 GMT<\/pubDate>/,
    );
  }
  const newest = dates[0]?.replace(/<\/?pubDate>/g, "") ?? "";
  expect(newest).not.toBe("");
  expect(xml).toContain(`<lastBuildDate>${newest}</lastBuildDate>`);
});

it("points at itself and leaves no unescaped markup in the text", () => {
  const xml = buildRssXml();

  expect(xml).toContain(`<atom:link href="${SITE_URL}${FEED_PATH}" rel="self"`);
  // Every ampersand must be the start of an entity, or the feed is malformed.
  expect(xml).not.toMatch(/&(?!amp;|lt;|gt;|quot;|apos;)/);
});
