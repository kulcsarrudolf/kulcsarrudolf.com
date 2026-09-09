import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

import {
  getPostContent,
  getPostMetadata,
  getProjectContent,
  getProjectMetadata,
  getRecentPosts,
} from "./content";

// Route loaders run on the server during SSR and in the browser on client-side
// navigation. These server functions keep the filesystem-backed content
// behind an RPC boundary so loaders can call them from either side.

export const fetchPosts = createServerFn({ method: "GET" }).handler(() => getPostMetadata());

export const fetchRecentPosts = createServerFn({ method: "GET" })
  .validator((limit: number) => limit)
  .handler(({ data }) => getRecentPosts(data));

export const fetchPost = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(({ data: slug }) => {
    const post = getPostContent(slug);

    if (!post) {
      throw notFound();
    }

    return post;
  });

export const fetchProjects = createServerFn({ method: "GET" }).handler(() => getProjectMetadata());

export const fetchProject = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(({ data: slug }) => {
    const project = getProjectContent(slug);

    if (!project) {
      throw notFound();
    }

    // Resolving through getPostMetadata means private posts drop out
    // automatically, so a project can safely reference a draft article.
    const posts = getPostMetadata();
    const relatedPosts = (project.relatedPosts ?? [])
      .map((postSlug) => posts.find((post) => post.slug === postSlug))
      .filter((post) => post !== undefined);

    return { project, relatedPosts };
  });
