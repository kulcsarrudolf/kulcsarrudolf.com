import { NextRequest, NextResponse } from "next/server";

// Serves blog posts and project pages as clean markdown for AI agents:
// - /posts/<slug>.md and /projects/<slug>.md always return markdown
// - /posts/<slug> and /projects/<slug> return markdown when the client
//   asks for it via an Accept: text/markdown header
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const mdExtensionMatch = pathname.match(/^\/(posts|projects)\/([^/]+)\.md$/);
  if (mdExtensionMatch) {
    const url = request.nextUrl.clone();
    url.pathname = `/markdown/${mdExtensionMatch[1]}/${mdExtensionMatch[2]}`;
    return NextResponse.rewrite(url);
  }

  const pageMatch = pathname.match(/^\/(posts|projects)\/([^/]+)$/);
  const accept = request.headers.get("accept") ?? "";
  if (pageMatch && accept.includes("text/markdown")) {
    const url = request.nextUrl.clone();
    url.pathname = `/markdown/${pageMatch[1]}/${pageMatch[2]}`;
    const response = NextResponse.rewrite(url);
    // Without this a CDN can serve the markdown response to HTML clients.
    response.headers.set("Vary", "Accept");
    return response;
  }

  return NextResponse.next();
}

// `:slug+` rather than `:slug*` so /projects itself does not invoke this.
export const config = {
  matcher: ["/posts/:slug*", "/projects/:slug+"],
};
