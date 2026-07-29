import fs from "fs";

import matter from "gray-matter";

import Project from "@/types/project.type";

const PROJECTS_FOLDER = "./src/projects";

const DEFAULT_ORDER = 100;

// Draft projects (private: true) are visible on the local dev server so they
// can be previewed, but stay hidden in the production build.
export const shouldShowPrivateProjects = (): boolean =>
  process.env.NODE_ENV === "development";

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

const toProject = (
  fileName: string,
  data: matter.GrayMatterFile<string>["data"]
): Project => ({
  title: data.title,
  subtitle: data.subtitle,
  slug: fileName.replace(".md", ""),
  order: typeof data.order === "number" ? data.order : DEFAULT_ORDER,
  lang: data.lang === "hu" ? "hu" : "en",
  schemaType:
    data.schemaType === "WebApplication"
      ? "WebApplication"
      : "SoftwareSourceCode",
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

// The projects list is a curated ordering rather than a chronological feed:
// `order` ascending, newest first when two projects tie.
const byOrderThenDate = (a: Project, b: Project): number => {
  if (a.order !== b.order) {
    return a.order - b.order;
  }

  return (b.date || "").localeCompare(a.date || "");
};

// Returned already sorted, so callers never have to re-sort.
export const getProjectMetadata = (): Project[] => {
  const files = fs.readdirSync(PROJECTS_FOLDER);

  const markdownProjects = files.filter((file: string) => file.endsWith(".md"));

  const projects = markdownProjects.map((fileName) => {
    const fileContents = fs.readFileSync(
      `${PROJECTS_FOLDER}/${fileName}`,
      "utf8"
    );

    return toProject(fileName, matter(fileContents).data);
  });

  const visibleProjects = shouldShowPrivateProjects()
    ? projects
    : projects.filter((project) => !project.private);

  return visibleProjects.sort(byOrderThenDate);
};

// Only slugs of published projects resolve, which also rejects private
// projects in production and any path-traversal attempt.
export const getProjectBySlug = (slug: string): Project | undefined =>
  getProjectMetadata().find((project) => project.slug === slug);

// Returns null rather than throwing, so an unknown slug can render a 404.
export const getProjectContent = (slug: string) => {
  const file = `${PROJECTS_FOLDER}/${slug}.md`;

  if (!getProjectBySlug(slug) || !fs.existsSync(file)) {
    return null;
  }

  return matter(fs.readFileSync(file, "utf8"));
};
