import matter from "gray-matter";

import type { BlogPost } from "@/types/blog-post";
import type { Project } from "@/types/project";

import { slugFromPath, toPost, toProject } from "./frontmatter";

// The markdown sources are bundled into the server build at compile time, so
// reading them never depends on the working directory of the deployed
// function. Only top-level files are matched: drafts and templates live in
// subfolders and are intentionally left out.
const postFiles = import.meta.glob("../content/posts/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const projectFiles = import.meta.glob("../content/projects/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

// A glob that matches nothing is not a type error: the cast above hides it, and
// the site would deploy with an empty blog. Fail the build instead.
const assertMatched = (files: Record<string, string>, pattern: string): void => {
  if (Object.keys(files).length === 0) {
    throw new Error(`No markdown files matched ${pattern}. Was the content folder moved?`);
  }
};

assertMatched(postFiles, "src/content/posts/*.md");
assertMatched(projectFiles, "src/content/projects/*.md");

// Draft content (private: true) is visible on the local dev server so it can
// be previewed, but stays hidden in the production build.
export const shouldShowPrivateContent = (): boolean => import.meta.env.DEV;

/* ---------------------------------- Posts --------------------------------- */

export type PostContent = BlogPost & { content: string };

const readPost = (path: string): PostContent => {
  const { data, content } = matter(postFiles[path]);
  return { ...toPost(slugFromPath(path), data), content };
};

const visiblePosts = (posts: PostContent[]): PostContent[] =>
  shouldShowPrivateContent() ? posts : posts.filter((post) => !post.private);

export const getPostMetadata = (): BlogPost[] =>
  visiblePosts(Object.keys(postFiles).map(readPost)).map(({ content: _content, ...post }) => post);

// Newest first. Used wherever a chronological list is wanted.
export const getRecentPosts = (limit: number): BlogPost[] =>
  [...getPostMetadata()].sort((a, b) => b.date.localeCompare(a.date)).slice(0, limit);

// Only slugs of published posts resolve, which also rejects private posts in
// production and any path-traversal attempt.
export const getPostContent = (slug: string): PostContent | null => {
  const path = Object.keys(postFiles).find((p) => slugFromPath(p) === slug);

  if (!path) {
    return null;
  }

  const post = readPost(path);

  return post.private && !shouldShowPrivateContent() ? null : post;
};

/* -------------------------------- Projects -------------------------------- */

export type ProjectContent = Project & { content: string };

const readProject = (path: string): ProjectContent => {
  const { data, content } = matter(projectFiles[path]);
  return { ...toProject(slugFromPath(path), data), content };
};

// The projects list is a curated ordering rather than a chronological feed:
// `order` ascending, newest first when two projects tie.
const byOrderThenDate = (a: Project, b: Project): number => {
  if (a.order !== b.order) {
    return a.order - b.order;
  }

  return (b.date || "").localeCompare(a.date || "");
};

const visibleProjects = (projects: ProjectContent[]): ProjectContent[] =>
  shouldShowPrivateContent() ? projects : projects.filter((project) => !project.private);

// Returned already sorted, so callers never have to re-sort.
export const getProjectMetadata = (): Project[] =>
  visibleProjects(Object.keys(projectFiles).map(readProject))
    .map(({ content: _content, ...project }) => project)
    .sort(byOrderThenDate);

// Returns null rather than throwing, so an unknown slug can render a 404.
export const getProjectContent = (slug: string): ProjectContent | null => {
  const path = Object.keys(projectFiles).find((p) => slugFromPath(p) === slug);

  if (!path) {
    return null;
  }

  const project = readProject(path);

  return project.private && !shouldShowPrivateContent() ? null : project;
};
