---
title: "Replacing Yarn with upm on This Site"
subtitle: "What got faster, what did not, and what it cost"
author: "Kulcsar Rudolf"
date: "2026-09-30"
description: "Moving this site off Yarn 1 to a modern package manager: Yarn 1, Yarn 4 and upm measured on local installs, CI and Vercel builds, and the trade-offs of running a prerelease."
keywords:
  [
    "upm",
    "unjs",
    "yarn",
    "package manager",
    "npm",
    "install speed",
    "benchmark",
    "vercel",
    "github actions",
    "docker",
  ]
private: false
---

## Why

This site installed its dependencies with Yarn 1, which dates from 2017 and has been in maintenance mode for years.
I wanted a modern package manager, and I picked [upm](https://github.com/unjs/upm), a new one from the UnJS team, written in TypeScript and about 250 KB on disk.

upm is a prerelease.
Its README says so, and this post is not advice to move a production project to it.

## How I measured

Local numbers are from an Apple M1 with 16 GB, macOS 15.3 and Node 24.17, timed with [hyperfine](https://github.com/sharkdp/hyperfine), 10 runs each, from a frozen lockfile, with the package caches in a folder of their own.
A cold install starts with no `node_modules` and an empty cache, a warm one with the cache filled, and a no-op with `node_modules` already in place.
Yarn 4 ran with the `node-modules` linker on a copy of the project from just before the move, and only locally.

CI numbers are the install steps of GitHub Actions runs, and Vercel numbers come from the build logs.

## Yarn 1 vs Yarn 4 vs upm

| Install        | Yarn 1.22.22 | Yarn 4.18.1 | upm 1.2.0 |
| -------------- | ------------ | ----------- | --------- |
| Cold           | 21.04 s      | 6.12 s      | 6.50 s    |
| Warm           | 3.70 s       | 3.50 s      | 3.88 s    |
| No-op          | 422 ms       | 523 ms      | 44 ms     |
| `node_modules` | 366 MB       | 343 MB      | 325 MB    |

Most of the gain comes from leaving Yarn 1.
Yarn 4 cuts the cold install as much as upm does and is a little faster on a warm one.
upm is ahead on the no-op check, twelve times faster than Yarn 4, and it runs that check before every `upm run`, so at 44 ms it costs nothing.
Its `node_modules` is also the smallest, and it is hardlinked to a shared store, so a second project with the same packages adds almost nothing.

Yarn 4 installed the project as it was, `resolutions` and all, and the checks and the build passed on it.

## CI

On GitHub Actions (`ubuntu-latest`), Yarn restored a dependency cache before installing.
upm has no cache step, because a cold install is quicker than the restore was.

| From checkout to installed     | Yarn 1.22.22 | upm 1.2.0  |
| ------------------------------ | ------------ | ---------- |
| Restoring the cache            | 19.4 s       | none       |
| Installing the package manager | in the image | 0 to 3 s   |
| Installing the dependencies    | 6.5 s        | 2 to 3 s   |
| The whole job                  | 45 s         | 17 to 27 s |

The Yarn column is the mean of eight runs that hit the cache; a miss took 39.5 s to install.
GitHub reports step times in whole seconds, so the upm column is a range.
The job takes about half as long, and most of the saving is the cache that is gone.

## Vercel

Vercel has no built-in support for upm, so `vercel.json` has an install command that installs upm and then the dependencies.
Vercel also restores `node_modules` from its build cache, so the cost of an install depends on whether the lockfile changed.

| Build on `develop`              | Yarn 1.22.19        | upm 1.2.0        |
| ------------------------------- | ------------------- | ---------------- |
| Lockfile changed: install       | about 30 s          | 6.3 s            |
| Lockfile changed: whole build   | 47 s, 56 s          | 19 s             |
| Lockfile unchanged: install     | 1.4 s               | 1.1 s            |
| Lockfile unchanged: whole build | 18 s (median of 10) | 16 s (one build) |

The upm build with a changed lockfile had no cache at all, and Yarn 1 still took about 30 s with its cache restored, because a changed lockfile makes it redo most of the work.
With an unchanged lockfile nothing changed: 1.0 s of upm's 1.1 s install is installing upm itself.

## What had to change first

upm could not install the project as it was.
It has no overrides, and `package.json` had nine `resolutions` for vulnerable transitive dependencies.
All of them had become unnecessary by then, so I deleted the block.

It also could not parse the peer range `@tailwindcss/typography` declares for `tailwindcss`, `>=3.0.0 || >=4.0.0 || insiders`, which mixes a dist-tag with version ranges.
npm and Yarn accept it, upm 1.2.0 stops with an error.
I replaced the plugin with about 300 lines of CSS and checked that the computed styles on every post and project page stayed the same in both themes.

## What it cost

- Dependabot cannot read `upm.lock`, so npm updates are manual and GitHub raises no security alerts for them.
- Without overrides, a vulnerable transitive dependency can only be fixed by updating the package that brings it in.
- upm runs no lifecycle scripts, not even the project's own, so the git hooks are installed with `upm run prepare` after cloning.
- Each Vercel build installs upm before the dependencies.
- Undeclared dependencies break. Yarn 1 hoists everything to the top of `node_modules`, and upm links only what is declared. After the move the dev server crashed on any request that threw, because Nitro's dev error handler imports `pathe` without listing it. I had tested the builds but not the dev server, and the fix was to add `pathe` to my own `devDependencies`.

## Verdict

Against Yarn 1, upm made cold installs three times faster and CI twice as fast.
Against Yarn 4 the installs are level, and upm only wins on the no-op check and the size of `node_modules`.
Yarn 4 would have given me a modern package manager without losing Dependabot or overrides.

For a personal site, where trying upm was part of the point, I am happy with the trade.
On a project with a team and customers I would move to Yarn 4, npm or pnpm, and come back to upm once it is stable.
