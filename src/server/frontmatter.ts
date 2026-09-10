import type { BlogPost } from "@/types/blog-post";
import type { Project } from "@/types/project";

// Turns a markdown file's path and parsed frontmatter into the typed records
// the site works with. Pure on purpose: `content.ts` calls it on the bundled
// sources, and `scripts/preview-images.ts` on the files on disk, so it must
// not touch `import.meta.glob` or path aliases at runtime.

export const slugFromPath = (path: string): string =>
  path.slice(path.lastIndexOf("/") + 1).replace(/\.md$/, "");

// Frontmatter list fields accept either a YAML list or a comma separated string.
export const toStringArray = (value: unknown): string[] | undefined => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim());
  }

  if (typeof value === "string" && value.trim() !== "") {
    return value.split(",").map((item) => item.trim());
  }

  return undefined;
};

export const toPost = (slug: string, data: Record<string, any>): BlogPost => ({
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

const DEFAULT_ORDER = 100;

export const toProject = (slug: string, data: Record<string, any>): Project => ({
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
