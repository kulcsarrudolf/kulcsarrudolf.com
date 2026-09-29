---
title: "Replacing Yarn with upm on This Site"
subtitle: "What got faster, what did not, and what it cost"
author: "Kulcsar Rudolf"
date: "2026-09-30"
description: "Measured results of moving this site from Yarn 1 to upm: local installs, CI and Vercel builds before and after, and the trade-offs of running a prerelease package manager."
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

This site installed its dependencies with Yarn 1, which has been in maintenance mode for years.
[upm](https://github.com/unjs/upm) is a new package manager from the UnJS team, written in TypeScript, about 250 KB on disk.
I wanted to know what it changes on a real project, so I measured before and after.

upm is a prerelease.
Its README says so, and this post is not advice to move a production project to it.

## How I measured

Local numbers are from an Apple M1 with 16 GB, macOS 15.3 and Node 24.17, timed with [hyperfine](https://github.com/sharkdp/hyperfine), 10 runs each, with the package caches in a folder of their own.
Every install is from a lockfile, frozen.

- **Cold**: no `node_modules`, empty cache.
- **Warm**: no `node_modules`, cache filled.
- **No-op**: `node_modules` already in place.

CI numbers are the install steps of GitHub Actions runs, and Vercel numbers come from the build logs.

## Local results

| Install | Yarn 1.22.22 | upm 1.2.0 | Change      |
| ------- | ------------ | --------- | ----------- |
| Cold    | 21.04 s      | 6.50 s    | 3.2x faster |
| Warm    | 3.70 s       | 3.88 s    | 5% slower   |
| No-op   | 422 ms       | 44 ms     | 9.5x faster |

`node_modules` went from 366 MB to 325 MB, and upm hardlinks it to a shared store, so a second project with the same packages adds almost nothing.

The cold install is where the difference is.
With a filled cache the two are level, and the no-op case matters more than it looks: upm checks the tree before every `upm run`, and at 44 ms that check is free.

## The same test on Yarn 4

Yarn 1 is from 2017, so the fair question is how much of that gain belongs to upm and how much to leaving Yarn 1.
I ran the same benchmark on Yarn 4.18.1 with the `node-modules` linker, on a copy of the project as it was just before the move.

| Install        | Yarn 1.22.22 | Yarn 4.18.1 | upm 1.2.0 |
| -------------- | ------------ | ----------- | --------- |
| Cold           | 21.04 s      | 6.12 s      | 6.50 s    |
| Warm           | 3.70 s       | 3.50 s      | 3.88 s    |
| No-op          | 422 ms       | 523 ms      | 44 ms     |
| `node_modules` | 366 MB       | 343 MB      | 325 MB    |

Nearly all of it belongs to leaving Yarn 1.
Yarn 4 is a little faster than upm on a cold and on a warm install.
upm keeps two wins: the no-op check, twelve times faster, and the smaller `node_modules`.

Yarn 4 also installed the project as it was, with the `resolutions` and the typography plugin in place, and the checks and the build passed on it.
I measured it locally only, not in CI or on Vercel.

## CI results

GitHub Actions, `ubuntu-latest`. With Yarn the workflow restored a dependency cache before installing; with upm there is no cache step at all, because a cold install is quicker than the restore was.

| From checkout to installed     | Yarn 1.22.22 | upm 1.2.0  |
| ------------------------------ | ------------ | ---------- |
| Restoring the cache            | 19.4 s       | none       |
| Installing the package manager | in the image | 0 to 3 s   |
| Installing the dependencies    | 6.5 s        | 2 to 3 s   |
| Total                          | 25.9 s       | 3 to 8 s   |
| The whole job                  | 45 s         | 17 to 27 s |

The Yarn column is the mean of eight runs that hit the cache; on a miss the total was 39.5 s.
The upm column is the range over the runs of the pull request, and GitHub reports step times in whole seconds, so it is coarse.
Even so, the job takes about half the time it did, and most of what went away is the cache.

## Vercel results

Vercel has no built-in support for upm, so `vercel.json` carries an install command that installs the package manager and then the dependencies.

Vercel restores `node_modules` from its build cache, so what an install costs depends on whether the lockfile changed.

| Build on `develop`              | Yarn 1.22.19        | upm 1.2.0        |
| ------------------------------- | ------------------- | ---------------- |
| Lockfile changed: install       | about 30 s          | 6.3 s            |
| Lockfile changed: whole build   | 47 s, 56 s          | 19 s             |
| Lockfile unchanged: install     | 1.4 s               | 1.1 s            |
| Lockfile unchanged: whole build | 18 s (median of 10) | 16 s (one build) |

The 6.3 s is the worst case for upm: the first build after the switch, with no cache at all, and 0.9 s of it is installing upm itself.
The two Yarn builds in the same row had their cache restored and still spent about 30 s fetching and linking, because a changed lockfile makes Yarn 1 redo most of the work.

On an ordinary build, where the lockfile did not change, there is nothing to win.
The install step was 1.4 s and is 1.1 s, of which 1.0 s is installing upm and 19 ms is upm finding the tree up to date.
The 16 s build is a single sample inside the range the Yarn builds already covered, so I read it as no change.

## What had to change first

upm could not install the project as it was, for two reasons.

**No overrides.**
`package.json` had nine `resolutions`, added over time to patch vulnerable transitive dependencies.
upm has no equivalent.
When I checked, every one of them had become unnecessary: the tree resolved to the pinned version or a newer one without them, so I deleted the block.

**A peer range it could not parse.**
`@tailwindcss/typography` declares `tailwindcss` as `>=3.0.0 || >=4.0.0 || insiders`, which joins a dist-tag to version ranges.
npm and Yarn tolerate that, upm 1.2.0 stops with an error, and without overrides there is no way around it.
I replaced the plugin with about 300 lines of hand-written CSS and checked that the computed style of every element on every post and project page stayed the same, in both themes.

## What it cost

- **No Dependabot.** It cannot read `upm.lock`, so npm updates are manual, and GitHub raises no security alerts for them.
- **No overrides.** A vulnerable transitive dependency can only be fixed by updating the package that brings it in.
- **No lifecycle scripts**, not even the project's own. The git hooks are installed with `upm run prepare` after cloning.
- **A custom install command on Vercel**, which has no built-in support for upm, so each build installs the package manager first.
- **Undeclared dependencies break.** Yarn 1 hoists every package to the top of `node_modules`, so a package can import one it never declared and get away with it. upm links only what is declared. After the move the dev server crashed on any request that threw, because Nitro's dev error handler imports `pathe` without listing it, and I had tested the builds but not the dev server. The fix was to add `pathe` to my own `devDependencies`.

## Verdict

| Where                          | Before | After      |
| ------------------------------ | ------ | ---------- |
| Local cold install             | 21.0 s | 6.5 s      |
| Local warm install             | 3.7 s  | 3.9 s      |
| Local no-op install            | 422 ms | 44 ms      |
| CI job                         | 45 s   | 17 to 27 s |
| Vercel build, lockfile changed | 47 s   | 19 s       |
| Vercel build, ordinary         | 18 s   | 16 s       |

The installs that start from nothing got about three times faster, and CI got about twice as fast, mostly by no longer needing a cache.
The install that runs every day, with a warm cache, did not change, and neither did an ordinary deploy.

That is upm against Yarn 1.
Against Yarn 4 the installs are level, and what upm adds is a no-op check that costs nothing and a smaller `node_modules`.

Against that stand no Dependabot, no overrides and a package manager that calls itself unstable, none of which Yarn 4 would have cost.
For a personal site, where trying upm was the point, that is a trade I am happy with.
For a project with a team and customers I would move to a current Yarn, npm or pnpm first, take the speed, and look at upm again when it is stable.
