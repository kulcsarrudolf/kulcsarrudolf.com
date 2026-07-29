---
title: "Mongoose Seed Kit"
subtitle: "Run Mongoose seed scripts once, and keep track of which ones ran."
description: "A zero-dependency seeder toolkit for Mongoose that runs seed scripts on startup, records their status in MongoDB, retries failures, and ships a CLI."
keywords:
  - mongoose-seed-kit
  - mongoose seeder
  - mongodb seeding
  - database migration
  - node.js
date: "2026-03-20"
updated: "2026-04-28"
order: 30
lang: "en"
github: "https://github.com/kulcsarrudolf/mongoose-seed-kit"
npm: "https://www.npmjs.com/package/mongoose-seed-kit"
tech:
  - Node.js
  - TypeScript
  - MongoDB
schemaType: "SoftwareSourceCode"
featured: true
private: false
---

A seeding toolkit for Mongoose that runs one-time database initialization scripts on application
startup and records what has already been executed. It exists because every project I worked on
kept reinventing the same "has this seed already run?" bookkeeping.

## Features

- Runs pending seeders on startup and tracks each result in MongoDB
- Retries failed seeders on the next run, leaving successful ones alone
- CLI to scaffold, run, inspect and reset seeders
- Programmatic API (`runPendingSeeders`, `runSeederByName`, `getSeederStatuses`, `resetSeeder`)
  for building admin routes
- Environment aware path resolution, so `src` and `dist` both work
- Zero external dependencies, no extra model registration

## Install

```bash
npm install mongoose-seed-kit
```

```bash
npx mongoose-seed-kit create add-default-roles
npx mongoose-seed-kit status
npx mongoose-seed-kit run
```

Requires Mongoose 6 or newer.

## Links

Source on [GitHub](https://github.com/kulcsarrudolf/mongoose-seed-kit), package on
[npm](https://www.npmjs.com/package/mongoose-seed-kit).
