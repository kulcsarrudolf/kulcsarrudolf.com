import { SITE_URL } from "@/config/site";

import { getPostMetadata, getProjectMetadata } from "./content";

// The XML sitemap: the static pages plus every published post and project.
type SitemapEntry = { url: string; lastModified?: string };

const escapeXml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

// `date` is optional on projects, so only send lastmod when we actually have
// a valid one. An Invalid Date would break the generated XML.
const toLastModified = (value?: string): string | undefined => {
  if (!value) {
    return undefined;
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
};

export const buildSitemapXml = (): string => {
  const pages: SitemapEntry[] = ["", "/blog", "/projects", "/quotes", "/contact"].map((path) => ({
    url: `${SITE_URL}${path}`,
  }));

  const posts: SitemapEntry[] = getPostMetadata().map((post) => ({
    url: `${SITE_URL}/posts/${post.slug}`,
    lastModified: toLastModified(post.date),
  }));

  const projects: SitemapEntry[] = getProjectMetadata().map((project) => ({
    url: `${SITE_URL}/projects/${project.slug}`,
    lastModified: toLastModified(project.updated || project.date),
  }));

  const entries = [...pages, ...posts, ...projects].map((entry) =>
    [
      "  <url>",
      `    <loc>${escapeXml(entry.url)}</loc>`,
      ...(entry.lastModified ? [`    <lastmod>${entry.lastModified}</lastmod>`] : []),
      "  </url>",
    ].join("\n"),
  );

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries,
    "</urlset>",
    "",
  ].join("\n");
};
