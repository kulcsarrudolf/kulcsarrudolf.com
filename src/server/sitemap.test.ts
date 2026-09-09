import { expect, it } from "vitest";

import { SITE_URL } from "@/config/site";

import { getPostMetadata, getProjectMetadata } from "./content";
import { buildSitemapXml } from "./sitemap";

const STATIC_PAGES = ["", "/blog", "/projects", "/quotes", "/contact"];

it("lists the static pages plus every post and project", () => {
  const xml = buildSitemapXml();
  const posts = getPostMetadata();
  const projects = getProjectMetadata();

  expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>\n<urlset')).toBe(true);
  expect(xml.match(/<url>/g)).toHaveLength(STATIC_PAGES.length + posts.length + projects.length);

  for (const path of STATIC_PAGES) {
    expect(xml).toContain(`<loc>${SITE_URL}${path}</loc>`);
  }
  for (const post of posts) {
    expect(xml).toContain(`<loc>${SITE_URL}/posts/${post.slug}</loc>`);
  }
});

it("only writes lastmod when the content carries a valid date", () => {
  const xml = buildSitemapXml();
  const lastmods = xml.match(/<lastmod>[^<]*<\/lastmod>/g) ?? [];
  const dated =
    getPostMetadata().filter((post) => post.date).length +
    getProjectMetadata().filter((project) => project.updated || project.date).length;

  expect(lastmods).toHaveLength(dated);
  for (const tag of lastmods) {
    expect(tag).toMatch(/<lastmod>\d{4}-\d{2}-\d{2}T[^<]+Z<\/lastmod>/);
  }
});
