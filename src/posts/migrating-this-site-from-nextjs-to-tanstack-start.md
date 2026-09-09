---
title: "Migrating This Site from Next.js to TanStack Start"
subtitle: "Same URLs, same server-side rendering, no Next.js"
author: "Kulcsar Rudolf"
date: "2026-09-09"
description: "Notes from moving this blog off Next.js 15 onto TanStack Start with Vite and Nitro, while keeping every route, the markdown endpoints, and full server-side rendering."
keywords:
  [
    "tanstack start",
    "tanstack router",
    "nextjs migration",
    "vite",
    "nitro",
    "server-side rendering",
    "vercel",
    "storybook",
    "oxlint",
    "react",
    "typescript",
  ]
private: false
---

## Why

This site ran on Next.js since 2019.
I wanted to try [TanStack Start](https://tanstack.com/start) and had two conditions: every page stays server-rendered, and no URL changes.
That includes the markdown twins of each post (`/posts/slug.md`), the `Accept: text/markdown` negotiation, `sitemap.xml`, `llms.txt`, a 301 from an old project page, and three aliases of the wedding countdown.

## What changed

Each URL is now one file under `src/routes/`.
A route declares a `loader` for its data, a `head()` for the title, canonical link and JSON-LD, and a component.
The markdown posts are bundled at build time with `import.meta.glob` and served through server functions, so the Vercel function never reads the filesystem.

The Next.js middleware became a request middleware in `src/start.ts`.
The sitemap and `llms.txt` are server routes.
The redirect is a route that throws `redirect({ statusCode: 301 })`.
The aliases are three small route files that reuse the same `head` and component.

`next/font` became Fontsource, `next/image` became a plain `img`, and `next/dynamic` became `ClientOnly` with `React.lazy` for the image zoom library, which touches `document` on import.

## Next.js vs TanStack Start in short

| | Next.js (app router) | TanStack Start |
| --- | --- | --- |
| Routing | Folders with `page.tsx` and `layout.tsx` | One file per route, links and params checked by TypeScript |
| Data | Async server components fetch inline | A `loader` per route that runs on the server for SSR and in the browser on navigation |
| Server-only code | Server components by default | Server functions; everything else runs on both sides |
| Metadata | `export const metadata` | `head()` on the route, with access to loader data |
| Build and server | Its own bundler and server | Vite for the build, Nitro for the server, one deploy target per preset |

For a site this size the day-to-day difference is the loader.
Data for a page lives next to the route, the component reads it with `Route.useLoaderData()`, and the same code path serves the first request and every client-side navigation after it.

## One thing I did not expect

The pages that read `?lang=` through `useSearchParams` were never fully server-rendered on Next.js.
They bailed out to client rendering and visitors saw "Loading..." for a moment.
Now the whole page comes from the server.

## Storybook and oxlint

Two tooling changes went in with the migration.

Every component under `src/components/` now has a story.
Storybook runs on its own small Vite config, because the app config loads the TanStack Start and Nitro plugins, and those only make sense for the real server build.
Each story renders inside a real TanStack Router with an in-memory history, so `Link` and `useNavigate` work without the app shell.
A toolbar sets the same `?lang=` query the site uses, so a component can be checked in English and Hungarian without leaving Storybook.

ESLint and its plugins became a single `oxlint` dependency.
The config keeps the same rules as the old flat config: correctness as errors, rules-of-hooks and exhaustive-deps on, unused variables allowed with a leading underscore.
A full run takes about half a second.

I did the whole migration in one sitting with [Claude Code](https://www.anthropic.com/claude-code).
The source is on [GitHub](https://github.com/kulcsarrudolf/kulcsarrudolf.com).
