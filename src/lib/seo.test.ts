import { describe, expect, it } from "vitest";

import { FEED_PATH, OG_SITE_IMAGE_PATH, SITE_NAME, SITE_URL } from "@/config/site";

import { pageHead, siteHead } from "./seo";

type Meta = Array<Record<string, string | undefined>>;

const find = (meta: Meta, key: "name" | "property", value: string) =>
  meta.find((entry) => entry[key] === value)?.content;

describe("pageHead", () => {
  const base = { title: "Blog", description: "All posts.", path: "/blog" };

  it("suffixes the site owner to the title unless the title is absolute", () => {
    expect(pageHead(base).meta[0]).toEqual({ title: "Blog | Kulcsar Rudolf" });
    expect(pageHead({ ...base, absoluteTitle: true }).meta[0]).toEqual({ title: "Blog" });
  });

  it("derives the canonical URL and og:url from the path", () => {
    const head = pageHead(base);

    expect(head.links).toEqual([{ rel: "canonical", href: `${SITE_URL}/blog` }]);
    expect(find(head.meta, "property", "og:url")).toBe(`${SITE_URL}/blog`);
  });

  it("emits article metadata only for articles", () => {
    const article = pageHead({
      ...base,
      type: "article",
      article: { publishedTime: "2026-01-02", authors: ["Kulcsar Rudolf"], tags: ["a", "b"] },
    });

    expect(find(article.meta, "property", "og:type")).toBe("article");
    expect(find(article.meta, "property", "article:published_time")).toBe("2026-01-02");
    expect(article.meta.filter((entry) => entry.property === "article:tag")).toHaveLength(2);
    expect(find(pageHead(base).meta, "property", "article:published_time")).toBeUndefined();
  });

  it("describes the page's preview card only when it has one", () => {
    expect(find(pageHead(base).meta, "property", "og:image")).toBeUndefined();

    const head = pageHead({ ...base, image: { path: "/og/posts/hello.png", alt: "Hello" } });

    expect(find(head.meta, "property", "og:image")).toBe(`${SITE_URL}/og/posts/hello.png`);
    expect(find(head.meta, "property", "og:image:width")).toBe("1200");
    expect(find(head.meta, "property", "og:image:height")).toBe("630");
    expect(find(head.meta, "property", "og:image:alt")).toBe("Hello");
    expect(find(head.meta, "name", "twitter:image")).toBe(`${SITE_URL}/og/posts/hello.png`);
  });

  it("asks robots to stay away when noindex is set", () => {
    expect(find(pageHead(base).meta, "name", "robots")).toBeUndefined();
    expect(find(pageHead({ ...base, noindex: true }).meta, "name", "robots")).toBe(
      "noindex, nofollow",
    );
  });

  it("serialises structured data as a JSON-LD script", () => {
    const data = { "@type": "WebPage", name: "Blog" };

    expect(pageHead({ ...base, structuredData: data }).scripts).toEqual([
      { type: "application/ld+json", children: JSON.stringify(data) },
    ]);
    expect(pageHead(base).scripts).toEqual([]);
  });
});

describe("siteHead", () => {
  it("links the stylesheet it is given and names the site", () => {
    const head = siteHead("/assets/globals.css");

    expect(head.links[0]).toEqual({ rel: "stylesheet", href: "/assets/globals.css" });
    expect(head.meta).toContainEqual({ title: SITE_NAME });
    expect(find(head.meta, "property", "og:image")).toBe(`${SITE_URL}${OG_SITE_IMAGE_PATH}`);
    expect(head.links).toContainEqual({
      rel: "alternate",
      type: "application/rss+xml",
      title: SITE_NAME,
      href: `${SITE_URL}${FEED_PATH}`,
    });
  });
});
