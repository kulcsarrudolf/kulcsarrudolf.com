import { ClientOnly } from "@tanstack/react-router";
import Markdown from "markdown-to-jsx";
import { Suspense, lazy, type AnchorHTMLAttributes, type ComponentProps } from "react";

// zimme-zoom injects styles into `document` when it is imported, so the image
// viewer is only loaded in the browser, after hydration.
const LazyPostImage = lazy(() => import("@/components/content/PostImage"));

const PostImage = (props: ComponentProps<typeof LazyPostImage>) => (
  <ClientOnly fallback={null}>
    <Suspense fallback={null}>
      <LazyPostImage {...props} />
    </Suspense>
  </ClientOnly>
);

const MarkdownLink = ({ href, children, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement>) => {
  const isInternal = href?.startsWith("/") ?? false;
  const externalProps = isInternal ? {} : { target: "_blank", rel: "noopener noreferrer" };
  return (
    <a href={href} {...externalProps} {...rest}>
      {children}
    </a>
  );
};

type MarkdownBodyProps = {
  content: string;
  /** Passed to the wrapper, so a page can mark the body up as microdata. */
  itemProp?: string;
};

/**
 * A rendered markdown document, in the typography plugin's `prose` styling.
 * The wrapper belongs here rather than at each call site: every caller wants
 * the same one, and the styling is part of what rendering markdown means.
 * `prose-invert` is the plugin's own dark palette, which covers the code
 * blocks, quotes and tables a post can carry in one go.
 */
const MarkdownBody = ({ content, itemProp }: MarkdownBodyProps) => {
  return (
    <div className="prose container mx-auto max-w-none dark:prose-invert" itemProp={itemProp}>
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
    </div>
  );
};

export default MarkdownBody;
