import { createCsrfMiddleware, createMiddleware, createStart } from "@tanstack/react-start";

import { MARKDOWN_HEADERS, buildPostMarkdown, buildProjectMarkdown } from "@/server/markdown";

type MarkdownTarget = { kind: "posts" | "projects"; slug: string };

// Serves blog posts and project pages as clean markdown for AI agents:
// - /posts/<slug>.md and /projects/<slug>.md always return markdown
// - /posts/<slug> and /projects/<slug> return markdown when the client
//   asks for it via an Accept: text/markdown header
const resolveMarkdownTarget = (pathname: string, accept: string): MarkdownTarget | null => {
  const extensionMatch = pathname.match(/^\/(posts|projects)\/([^/]+)\.md$/);
  if (extensionMatch) {
    return { kind: extensionMatch[1] as MarkdownTarget["kind"], slug: extensionMatch[2] };
  }

  const pageMatch = pathname.match(/^\/(posts|projects)\/([^/]+)$/);
  if (pageMatch && accept.includes("text/markdown")) {
    return { kind: pageMatch[1] as MarkdownTarget["kind"], slug: pageMatch[2] };
  }

  return null;
};

const markdownMiddleware = createMiddleware({ type: "request" }).server(
  ({ request, pathname, handlerType, next }) => {
    if (handlerType !== "router" || request.method !== "GET") {
      return next();
    }

    const target = resolveMarkdownTarget(pathname, request.headers.get("accept") ?? "");

    if (!target) {
      return next();
    }

    const body =
      target.kind === "posts" ? buildPostMarkdown(target.slug) : buildProjectMarkdown(target.slug);

    // Without Vary a CDN could serve the markdown response to HTML clients.
    if (!body) {
      return new Response("Not found", {
        status: 404,
        headers: { "Content-Type": "text/plain; charset=utf-8", Vary: "Accept" },
      });
    }

    return new Response(body, {
      headers: { ...MARKDOWN_HEADERS, Vary: "Accept" },
    });
  },
);

// Server functions are same-origin RPC endpoints; refuse cross-site calls.
const csrfMiddleware = createCsrfMiddleware({
  filter: (ctx) => ctx.handlerType === "serverFn",
});

export const startInstance = createStart(() => ({
  requestMiddleware: [csrfMiddleware, markdownMiddleware],
}));
