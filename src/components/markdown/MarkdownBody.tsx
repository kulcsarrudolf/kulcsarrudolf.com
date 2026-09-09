import { ClientOnly } from "@tanstack/react-router";
import Markdown from "markdown-to-jsx";
import { Suspense, lazy, type AnchorHTMLAttributes, type ComponentProps } from "react";

// zimme-zoom injects styles into `document` when it is imported, so the image
// viewer is only loaded in the browser, after hydration.
const LazyPostImage = lazy(() => import("@/components/blog/PostImage"));

const PostImage = (props: ComponentProps<typeof LazyPostImage>) => (
  <ClientOnly fallback={null}>
    <Suspense fallback={null}>
      <LazyPostImage {...props} />
    </Suspense>
  </ClientOnly>
);

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
