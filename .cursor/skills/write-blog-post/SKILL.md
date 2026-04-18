---
name: write-blog-post
description: Draft a blog post for `src/posts/` in Rudolf's voice. Use when the user wants to write, draft, outline, or refine a new post for the site, or mentions writing for the blog.
---

# Write a blog post

You are helping Rudolf, a software developer, write a post for `src/posts/` on his personal site. Keep it simple, technical, and pleasant to read for other engineers.

## When to use this skill

- The user asks for a new blog post, draft, or outline.
- The user wants to refine an existing draft in `src/posts/draft/`.
- The user shares an idea and wants it shaped into a post.

## Writing rules (Rudolf's voice)

- Simple, clear English at a B2 level.
- Short sentences. Aim for under 20 words.
- Never use the passive voice.
- Never use the em dash (`—`). Use a period or a comma.
- No fancy vocabulary. No marketing words.
- First person, technical, professional.
- Write for engineers: clear, scannable, pleasant.

## Post structure

Every post lives in `src/posts/<kebab-case-slug>.md` and follows this shape:

1. **Frontmatter**

   ```md
   ---
   title: "Short, Specific Title"
   subtitle: "One line that sharpens the title"
   author: "Kulcsar Rudolf"
   date: "YYYY-MM-DD"
   description: "One or two sentences for meta description and previews."
   keywords: ["keyword one", "keyword two", "keyword three"]
   ---
   ```

2. **`## Introduction`**. 1-2 short paragraphs. State the problem or context.
3. **Optional `### TL;DR`** right after the intro, for longer or technical posts.
4. **3-5 body `##` sections**. One idea per section, 1-2 short paragraphs each.
5. **Closing `##` section**. Use `## In Conclusion`, `## What's next`, or a question for the reader with a link to reply (LinkedIn, GitHub, email).

Reference posts:

- `src/posts/the-right-tech-stack-for-your-next-project.md`
- `src/posts/my-first-open-source-project.md`
- `src/posts/the-impact-of-podcasts-on-my-software-career.md`
- `src/posts/about-this-website.md`

## Best practices for technical posts

- **Lead with the problem**, not the tool. Open with the pain the reader already feels.
- **Show, then explain.** Put a short code block or concrete example first. Then add one or two lines of "why".
- **Code blocks**: use fenced blocks with a language tag (`ts`, `bash`, `json`, `tsx`). Keep snippets under 15 lines. Trim imports and boilerplate.
- **One idea per section.** If a `##` section grows past 5 short paragraphs, split it.
- **Concrete over abstract.** Prefer real version numbers, file paths, and error messages over "some library" or "a config".
- **Link, don't repeat.** Link to docs, npm, GitHub, and communities. Do not re-explain what the docs already cover.
- **Name trade-offs.** For any recommendation, add one line on when it is a bad fit.
- **Keep the reader in flow.** Use `**bold**` for key terms, short bullet lists of 3-6 items, and inline `code` for file names, commands, and APIs.
- **Version and date your claims.** Mention Node, Next.js, or library versions when behavior depends on them. The post ages better this way.
- **Safety nets.** If a snippet can break production, the database, or leak secrets, add a one-line warning above it.
- **Close with action.** End with what to try next, a repo link, or a question for the reader.
- **No AI tells.** Avoid phrases like "in the ever-evolving landscape", "delve into", "unleash the power of", "game-changer", "seamlessly", "leverage".

## Checklist before you hand off

- [ ] Sentences under ~20 words.
- [ ] No em dash, no passive voice, no buzzwords.
- [ ] Every code block has a language tag and runs (or is marked as pseudo-code).
- [ ] Every external claim has a link or a version.
- [ ] Links for tools, repos, and communities follow the pattern of existing posts.
- [ ] File saved to `src/posts/<slug>.md` with a kebab-case slug.
- [ ] Frontmatter has `title`, `subtitle`, `author`, `date`, `description`, `keywords`.

## What this skill does not do

- It does not publish, commit, or push the post.
- It does not run the dev server.
- It does not invent technical facts. If a detail is unclear, ask the user.

## Mini example

````md
---
title: "Stop Fighting Your ESLint Config"
subtitle: "A small setup that scales across Next.js projects"
author: "Kulcsar Rudolf"
date: "2026-04-18"
description: "A minimal ESLint and Prettier setup I reuse across Next.js projects, with the trade-offs I hit along the way."
keywords: ["eslint", "prettier", "nextjs", "typescript", "developer experience"]
---

## Introduction

Every new Next.js project starts the same way for me. I copy an ESLint config, fix three errors I do not understand, and move on. After the fifth project, I stopped and built a small setup I actually trust.

### TL;DR

Use `eslint-config-next`, add Prettier through `eslint-config-prettier`, and keep rules minimal. Anything else is a team decision, not a default.

## The base config

```json
{
  "extends": ["next/core-web-vitals", "next/typescript", "prettier"]
}
```

This gives me Next.js rules, TypeScript rules, and no fights with Prettier. I add project-specific rules only when the team agrees on them.

## When this is a bad fit

If you work in a large monorepo with shared packages, you probably need a flat config and shared presets. This setup targets a single app.

## What's next

I keep the full config in [this gist](https://gist.github.com/). If you have a lighter setup, I would like to see it. Send it to me on [LinkedIn](https://www.linkedin.com/in/kulcsarrudolf/).
```
````
