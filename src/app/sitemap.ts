import type { MetadataRoute } from "next";

import { getPostMetadata } from "@/utils/getPostMetadata";
import { SITE_URL } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = [
    "",
    "/blog",
    "/projects",
    "/quotes",
    "/contact",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
  }));

  const posts: MetadataRoute.Sitemap = getPostMetadata().map((post) => ({
    url: `${SITE_URL}/posts/${post.slug}`,
    lastModified: new Date(post.date),
  }));

  return [...pages, ...posts];
}
