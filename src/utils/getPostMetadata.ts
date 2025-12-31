import fs from "fs";
import matter from "gray-matter";

import BlogPost from "@/types/blog-post.type";

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
    };
  });

  return posts;
};
