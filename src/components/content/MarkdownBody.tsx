import { ClientOnly } from "@tanstack/react-router";
import Markdown from "markdown-to-jsx";
import {
  Suspense,
  lazy,
  useMemo,
  type AnchorHTMLAttributes,
  type ComponentProps,
  type ComponentType,
} from "react";

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

/** The attributes of a tag in markdown, which all arrive as strings. */
type EmbedProps = Record<string, string>;

/** Components a document may place in its markdown as a tag of the same name. */
export type Embeds = Record<string, ComponentType<EmbedProps>>;

/**
 * An embed drawn in the browser only, after hydration, once its code has
 * loaded: it is usually lazy, and nothing it renders is needed to read the
 * text around it.
 */
const inBrowser = (Embed: ComponentType<EmbedProps>) => {
  const Wrapped = (props: EmbedProps) => (
    <ClientOnly fallback={null}>
      <Suspense fallback={null}>
        <Embed {...props} />
      </Suspense>
    </ClientOnly>
  );
  return Wrapped;
};

type MarkdownBodyProps = {
  content: string;
  /** What the page lets this document embed, beyond `<PostImage>`. */
  embeds?: Embeds;
  /** Passed to the wrapper, so a page can mark the body up as microdata. */
  itemProp?: string;
};

/**
 * A rendered markdown document, in the `prose` styling of `styles/prose.css`.
 * The wrapper belongs here rather than at each call site: every caller wants
 * the same one, and the styling is part of what rendering markdown means.
 * The dark palette lives in that stylesheet too, so the code blocks, quotes
 * and tables a post can carry follow the theme without a class of their own.
 */
const MarkdownBody = ({ content, itemProp, embeds }: MarkdownBodyProps) => {
  const wrapped = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(embeds ?? {}).map(([name, Embed]) => [
          name,
          { component: inBrowser(Embed) },
        ]),
      ),
    [embeds],
  );

  return (
    <div className="prose container mx-auto max-w-none" itemProp={itemProp}>
      <Markdown
        options={{
          overrides: {
            a: {
              component: MarkdownLink,
            },
            PostImage: {
              component: PostImage,
            },
            ...wrapped,
          },
        }}
      >
        {content}
      </Markdown>
    </div>
  );
};

export default MarkdownBody;
