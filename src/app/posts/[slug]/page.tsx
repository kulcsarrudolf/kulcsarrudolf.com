import fs from "fs";

import Markdown from "markdown-to-jsx";
import matter from "gray-matter";

import { Title, Subtitle } from "@/components/general/typography";

import { getPostMetadata } from "@/utils/getPostMetadata";
import PostedOn from "@/components/general/PostedOn";

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

type Params = Promise<{ slug: string }>;

const PostPage = async ({ params }: { params: Params }) => {
  const { slug } = await params;
  const post = getPostContent(slug);

  return (
    <div>
      <Title>{post.data.title}</Title>
      <Subtitle>{post.data.subtitle}</Subtitle>
      <PostedOn date={post.data.date} />
      <article className="prose prose-sans container mx-auto max-w-none">
        <Markdown>{post.content}</Markdown>
      </article>
    </div>
  );
};

export default PostPage;
