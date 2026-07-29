"use client";

import dynamic from "next/dynamic";
import Markdown from "markdown-to-jsx";
import { AnchorHTMLAttributes } from "react";

const PostImage = dynamic(() => import("@/components/blog/PostImage"), {
  ssr: false,
});

const MarkdownLink = ({
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

type MarkdownBodyProps = {
  content: string;
};

const MarkdownBody = ({ content }: MarkdownBodyProps) => {
  return (
    <Markdown
      options={{
        overrides: {
          a: {
            component: MarkdownLink,
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

export default MarkdownBody;
