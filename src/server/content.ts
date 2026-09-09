import matter from "gray-matter";

import type BlogPost from "@/types/blog-post.type";
import type Project from "@/types/project.type";

// The markdown sources are bundled into the server build at compile time, so
// reading them never depends on the working directory of the deployed
// function. Only top-level files are matched: drafts and templates live in
// subfolders and are intentionally left out.
const postFiles = import.meta.glob("../posts/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const projectFiles = import.meta.glob("../projects/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

// Draft content (private: true) is visible on the local dev server so it can
// be previewed, but stays hidden in the production build.
export const shouldShowPrivateContent = (): boolean => import.meta.env.DEV;

const slugFromPath = (path: string): string =>
  path.slice(path.lastIndexOf("/") + 1).replace(/\.md$/, "");

// Frontmatter list fields accept either a YAML list or a comma separated string.
const toStringArray = (value: unknown): string[] | undefined => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim());
  }

  if (typeof value === "string" && value.trim() !== "") {
    return value.split(",").map((item) => item.trim());
  }

  return undefined;
};

/* ---------------------------------- Posts --------------------------------- */

export type PostContent = BlogPost & { content: string };

const toPost = (slug: string, data: Record<string, any>): BlogPost => ({
  title: data.title,
  date: data.date,
  subtitle: data.subtitle,
  author: data.author,
  slug,
  lang: data.lang === "hu" ? "hu" : "en",
  description: data.description,
  keywords: toStringArray(data.keywords),
  private: data.private === true,
});

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

const DEFAULT_ORDER = 100;

const toProject = (slug: string, data: Record<string, any>): Project => ({
  title: data.title,
  subtitle: data.subtitle,
  slug,
  order: typeof data.order === "number" ? data.order : DEFAULT_ORDER,
  lang: data.lang === "hu" ? "hu" : "en",
  schemaType: data.schemaType === "WebApplication" ? "WebApplication" : "SoftwareSourceCode",
  date: data.date || undefined,
  updated: data.updated || undefined,
  description: data.description,
  keywords: toStringArray(data.keywords),
  github: data.github || undefined,
  npm: data.npm || undefined,
  website: data.website || undefined,
  tech: toStringArray(data.tech),
  relatedPosts: toStringArray(data.relatedPosts),
  featured: data.featured === true,
  private: data.private === true,
});

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
