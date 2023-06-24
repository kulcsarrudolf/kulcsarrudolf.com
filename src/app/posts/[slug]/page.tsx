import fs from "fs";

import Markdown from "markdown-to-jsx";
import matter from "gray-matter";

import { Title, Subtitle } from "@/components/general/typography";

import { getPostMetadata } from "@/utils/getPostMetadata";

const getPostContent = (slug: string) => {
  const folder = "./src/posts";
  const file = `${folder}/${slug}.md`;
  const content = fs.readFileSync(file, "utf8");
  const matterResult = matter(content);

  return matterResult;
};

export const generateStaticParams = () => {
  const posts = getPostMetadata();

  return posts.map((post) => {
    return { slug: post.slug };
  });
};

const PostPage = (props: any) => {
  const slug = props.params.slug;
  const post = getPostContent(slug);

  return (
    <div>
      <Title>{post.data.title}</Title>
      <Subtitle>{post.data.subtitle}</Subtitle>
      <article className="prose container mx-auto max-w-none">
        <Markdown>{post.content}</Markdown>
      </article>
    </div>
  );
};

export default PostPage;
