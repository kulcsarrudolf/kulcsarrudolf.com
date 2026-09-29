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
Both sides install from a lockfile with `--frozen-lockfile`.

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

The baseline matters here.
Yarn 1 is from 2017, and part of the cold install gain would come from moving to any current package manager.

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

TODO

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

## Verdict

TODO
