import fs from "fs";
import matter from "gray-matter";

import BlogPost from "@/types/blog-post.type";

// Draft posts (private: true) are visible on the local dev server so they
// can be previewed, but stay hidden in the production build.
export const shouldShowPrivatePosts = (): boolean =>
  process.env.NODE_ENV === "development";

export const getPostMetadata = (): BlogPost[] => {
  const folder = "./src/posts";

  const files = fs.readdirSync(folder);

  const markdownPosts = files.filter((file: string) => file.endsWith(".md"));

  const posts = markdownPosts.map((fileName) => {
    const fileContents = fs.readFileSync(`./src/posts/${fileName}`, "utf8");
    const matterResult = matter(fileContents);

    return {
      title: matterResult.data.title,
      date: matterResult.data.date,
      subtitle: matterResult.data.subtitle,
      author: matterResult.data.author,
      slug: fileName.replace(".md", ""),
      lang: matterResult.data.lang,
      description: matterResult.data.description,
      keywords: matterResult.data.keywords
        ? Array.isArray(matterResult.data.keywords)
          ? matterResult.data.keywords
          : matterResult.data.keywords.split(",").map((k: string) => k.trim())
        : undefined,
      private: matterResult.data.private === true,
    };
  });

  if (shouldShowPrivatePosts()) {
    return posts;
  }

  return posts.filter((post) => !post.private);
};
