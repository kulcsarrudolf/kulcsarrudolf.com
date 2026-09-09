import MarkdownBody from "@/components/content/MarkdownBody";
import { Subtitle, Title } from "@/components/ui/typography";
import { SITE_NAME } from "@/config/site";
import PostedOn from "@/features/blog/PostedOn";
import type { PostContent } from "@/server/content";

interface PostPageProps {
  post: PostContent;
}

export default function PostPage({ post }: PostPageProps) {
  return (
    <article itemScope itemType="https://schema.org/BlogPosting">
      <meta itemProp="publisher" content={SITE_NAME} />
      <Title itemProp="headline">{post.title}</Title>
      <Subtitle itemProp="description">{post.subtitle}</Subtitle>
      <PostedOn date={post.date} />
      <MarkdownBody content={post.content} itemProp="articleBody" />
    </article>
  );
}
