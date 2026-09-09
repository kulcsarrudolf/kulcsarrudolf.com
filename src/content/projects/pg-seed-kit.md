---
title: "PG Seed Kit"
subtitle: "Run Postgres seeds once, whichever ORM you use."
description: "A zero-dependency Postgres seeder toolkit that tracks which seeds have run and applies each one exactly once, with adapters for Prisma, Drizzle, TypeORM and Sequelize."
keywords:
  - pg-seed-kit
  - postgres seeder
  - database seeding
  - prisma
  - drizzle
  - typeorm
  - sequelize
date: "2026-07-16"
updated: "2026-07-16"
order: 40
lang: "en"
github: "https://github.com/kulcsarrudolf/pg-seed-kit"
npm: "https://www.npmjs.com/package/pg-seed-kit"
website: "https://kulcsarrudolf.github.io/pg-seed-kit/"
tech:
  - TypeScript
  - Node.js
  - PostgreSQL
schemaType: "SoftwareSourceCode"
featured: true
private: false
---

A seeder toolkit for Postgres that runs one-time seed scripts on startup and records which ones
have already been applied, so each seeder runs exactly once. It is the Postgres counterpart to
[Mongoose Seed Kit](/projects/mongoose-seed-kit), built the same way and for the same reason.

## Features

- Runs pending seeders on startup and tracks each result, creating the tracking table on first run
- Retries failed seeders on the next run, leaving successful ones untouched
- Adapters for Prisma, Drizzle, TypeORM and Sequelize, imported as subpaths such as
  `pg-seed-kit/prisma`
- Reuses your ORM's existing connection, so there is nothing extra to configure
- CLI to create, run, inspect and reset seeders
- Zero runtime dependencies

## Install

```bash
npm install pg-seed-kit
```

```bash
npx pg-seed-kit create add-default-roles
npx pg-seed-kit status
npx pg-seed-kit run
```

## Links

Source on [GitHub](https://github.com/kulcsarrudolf/pg-seed-kit), package on
[npm](https://www.npmjs.com/package/pg-seed-kit), docs at
[kulcsarrudolf.github.io/pg-seed-kit](https://kulcsarrudolf.github.io/pg-seed-kit/).
