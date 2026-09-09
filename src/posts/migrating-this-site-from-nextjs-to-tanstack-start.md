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
    "react",
    "typescript",
  ]
private: false
---

## Why

This site ran on Next.js since 2019. I wanted to try [TanStack Start](https://tanstack.com/start) and had two conditions: every page stays server-rendered, and no URL changes. That includes the markdown twins of each post (`/posts/slug.md`), the `Accept: text/markdown` negotiation, `sitemap.xml`, `llms.txt`, a 301 from an old project page, and three aliases of the wedding countdown.

## What changed

Each URL is now one file under `src/routes/`. A route declares a `loader` for its data, a `head()` for the title, canonical link and JSON-LD, and a component. The markdown posts are bundled at build time with `import.meta.glob` and served through server functions, so the Vercel function never reads the filesystem.

The Next.js middleware became a request middleware in `src/start.ts`. The sitemap and `llms.txt` are server routes. The redirect is a route that throws `redirect({ statusCode: 301 })`. The aliases are three small route files that reuse the same `head` and component.

`next/font` became Fontsource, `next/image` became a plain `img`, and `next/dynamic` became `ClientOnly` with `React.lazy` for the image zoom library, which touches `document` on import.

## Two things I did not expect

The pages that read `?lang=` through `useSearchParams` were never fully server-rendered on Next.js. They bailed out to client rendering and visitors saw "Loading..." for a moment. Now the whole page comes from the server.

The first deploy failed. The Vercel project still had the Next.js preset, so it looked for a `next` dependency and stopped. A `vercel.json` with `"framework": "tanstack-start"` fixed it, and client-side env vars had to be renamed to the `VITE_` prefix.

I did the whole migration in one sitting with [Claude Code](https://www.anthropic.com/claude-code). The source is on [GitHub](https://github.com/kulcsarrudolf/kulcsarrudolf.com).
