export interface Project {
  title: string;
  subtitle: string;
  slug: string;
  order: number;
  lang: "hu" | "en";
  schemaType: "SoftwareSourceCode" | "WebApplication";
  date?: string;
  updated?: string;
  description?: string;
  keywords?: string[];
  github?: string;
  npm?: string;
  website?: string;
  tech?: string[];
  relatedPosts?: string[];
  featured?: boolean;
  private?: boolean;
}

export default Project;
