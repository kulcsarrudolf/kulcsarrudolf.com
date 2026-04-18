"use client";

import dynamic from "next/dynamic";
import Markdown from "markdown-to-jsx";

const PostImage = dynamic(() => import("@/components/blog/PostImage"), {
  ssr: false,
});

type PostBodyProps = {
  content: string;
};

const PostBody = ({ content }: PostBodyProps) => {
  return (
    <Markdown
      options={{
        overrides: {
          a: {
            props: {
              target: "_blank",
              rel: "noopener noreferrer",
            },
          },
          PostImage: {
            component: PostImage,
          },
        },
      }}
    >
      {content}
    </Markdown>
  );
};

export default PostBody;
