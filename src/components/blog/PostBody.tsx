"use client";

import dynamic from "next/dynamic";
import Markdown from "markdown-to-jsx";
import { AnchorHTMLAttributes } from "react";

const PostImage = dynamic(() => import("@/components/blog/PostImage"), {
  ssr: false,
});

const PostLink = ({
  href,
  children,
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement>) => {
  const isInternal = href?.startsWith("/") ?? false;
  const externalProps = isInternal
    ? {}
    : { target: "_blank", rel: "noopener noreferrer" };
  return (
    <a href={href} {...externalProps} {...rest}>
      {children}
    </a>
  );
};

type PostBodyProps = {
  content: string;
};

const PostBody = ({ content }: PostBodyProps) => {
  return (
    <Markdown
      options={{
        overrides: {
          a: {
            component: PostLink,
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
