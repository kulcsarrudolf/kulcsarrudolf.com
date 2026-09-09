import type BlogPost from "@/types/blog-post.type";
import type Project from "@/types/project.type";
import type Quote from "@/types/quote.type";

// Sample content for stories. Shapes mirror the frontmatter of real posts
// and projects, but nothing here is loaded from src/posts or src/projects.

export const posts: BlogPost[] = [
  {
    title: "Migrating from Next.js to TanStack Start",
    subtitle: "What changed, what broke, and what I would do again.",
    date: "2026-09-05",
    author: "Kulcsár Rudolf",
    slug: "migrating-from-nextjs-to-tanstack-start",
    lang: "en",
  },
  {
    title: "From course notes to a real AI agent app",
    subtitle: "Turning a weekend of notes into a small, shippable tool.",
    date: "2026-06-14",
    author: "Kulcsár Rudolf",
    slug: "from-course-notes-to-a-real-ai-agent-app",
    lang: "en",
  },
  {
    title: "Hogyan írok blogot Markdownban",
    subtitle: "Egy egyszerű munkafolyamat, ami évek óta működik.",
    date: "2026-03-02",
    author: "Kulcsár Rudolf",
    slug: "hogyan-irok-blogot-markdownban",
    lang: "hu",
  },
  {
    title: "Click-to-zoom images with zimme-zoom",
    subtitle: "A tiny React library for image viewers, and why I wrote it.",
    date: "2025-11-20",
    author: "Kulcsár Rudolf",
    slug: "click-to-zoom-images-with-zimme-zoom",
    lang: "en",
  },
];

export const projects: Project[] = [
  {
    title: "zimme-zoom",
    subtitle: "A small React library for click-to-zoom images with a photo viewer.",
    slug: "zimme-zoom",
    order: 1,
    lang: "en",
    schemaType: "SoftwareSourceCode",
    github: "https://github.com/kulcsarrudolf/zimme-zoom",
    npm: "https://www.npmjs.com/package/zimme-zoom",
    website: "https://zimme-zoom.kulcsarrudolf.com",
    tech: ["React", "TypeScript", "Vite"],
    relatedPosts: ["click-to-zoom-images-with-zimme-zoom"],
  },
  {
    title: "samsung-device-helper",
    subtitle: "CLI helpers for flashing and inspecting Samsung devices.",
    slug: "samsung-device-helper",
    order: 2,
    lang: "en",
    schemaType: "SoftwareSourceCode",
    github: "https://github.com/kulcsarrudolf/samsung-device-helper",
    tech: ["Node.js", "adb"],
  },
  {
    title: "Esküvői visszaszámláló",
    subtitle: "Egyoldalas visszaszámláló a nagy napig.",
    slug: "eskuvoi-visszaszamlalo",
    order: 3,
    lang: "hu",
    schemaType: "WebApplication",
  },
];

export const quote: Quote = {
  id: "story",
  quote: "Continuous improvement is better than delayed perfection.",
  author: "Mark Twain",
};

export const markdown = `
This is a paragraph with **bold text**, *italics* and an
[internal link](/blog) next to an [external link](https://react.dev).

## A second-level heading

- A list item
- Another item with \`inline code\`

\`\`\`ts
export function greet(name: string) {
  return \`Hello, \${name}!\`;
}
\`\`\`

<PostImage
  src="/images/me-logo.png"
  alt="A sample post image that opens in the photo viewer on click"
  title="Click the image to zoom"
/>

> Blockquotes are rendered through the Tailwind typography plugin.
`;
