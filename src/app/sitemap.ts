import type { MetadataRoute } from "next";

import { getPostMetadata } from "@/utils/getPostMetadata";
import { getProjectMetadata } from "@/utils/getProjectMetadata";
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

  // `date` is optional on projects, so only send lastModified when we
  // actually have one. An Invalid Date would break the generated XML.
  const projects: MetadataRoute.Sitemap = getProjectMetadata().map(
    (project) => {
      const changedAt = project.updated || project.date;

      return {
        url: `${SITE_URL}/projects/${project.slug}`,
        ...(changedAt ? { lastModified: new Date(changedAt) } : {}),
      };
    }
  );

  return [...pages, ...posts, ...projects];
}
