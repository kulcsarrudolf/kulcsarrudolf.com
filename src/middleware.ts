import { NextRequest, NextResponse } from "next/server";

// Serves blog posts as clean markdown for AI agents:
// - /posts/<slug>.md always returns markdown
// - /posts/<slug> returns markdown when the client asks for it
//   via an Accept: text/markdown header
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const mdExtensionMatch = pathname.match(/^\/posts\/([^/]+)\.md$/);
  if (mdExtensionMatch) {
    const url = request.nextUrl.clone();
    url.pathname = `/markdown/posts/${mdExtensionMatch[1]}`;
    return NextResponse.rewrite(url);
  }

  const postMatch = pathname.match(/^\/posts\/([^/]+)$/);
  const accept = request.headers.get("accept") ?? "";
  if (postMatch && accept.includes("text/markdown")) {
    const url = request.nextUrl.clone();
    url.pathname = `/markdown/posts/${postMatch[1]}`;
    const response = NextResponse.rewrite(url);
    response.headers.set("Vary", "Accept");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/posts/:slug*"],
};
