---
title: "Samsung Device Helper"
subtitle: "Look up Samsung phones, tablets and watches by model number."
description: "A zero-dependency Node.js package that resolves Samsung model numbers to device names and returns categorized device lists, kept current by an AI agent."
keywords:
  - samsung-device-helper
  - samsung model number
  - device lookup
  - node.js
  - npm package
date: "2024-07-18"
updated: "2026-07-23"
order: 20
lang: "en"
github: "https://github.com/kulcsarrudolf/samsung-device-helper"
npm: "https://www.npmjs.com/package/samsung-device-helper"
tech:
  - Node.js
  - TypeScript
relatedPosts:
  - my-first-open-source-project
schemaType: "SoftwareSourceCode"
featured: true
private: false
---

A Node.js package that turns a Samsung model number into a human readable device name, and returns
categorized lists of phones, tablets and watches. It was my first open source project and it is
still the one people install most often.

## Features

- `getNameByModel(model)` resolves a model number to a device name
- `getAllSamsungPhones()`, `getAllSamsungTablets()` and `getAllSamsungWatches()` return full lists
- `getAllSamsungDevices()` returns everything across categories
- Phone catalogue covers models released from 2017 onwards
- Subpath imports so you only bundle the category you need

## Install

```bash
npm install samsung-device-helper
```

## Keeping the catalogue current

The catalogue is maintained by a companion
[AI agent](https://github.com/kulcsarrudolf/samsung-device-helper-agent) that uses Playwright MCP
and Claude. It reads the current year's device file from GitHub, scrapes GSM Arena for new
releases, sorts them by release date, and opens a pull request automatically whenever the
catalogue has fallen behind.

## Links

Source on [GitHub](https://github.com/kulcsarrudolf/samsung-device-helper), package on
[npm](https://www.npmjs.com/package/samsung-device-helper).
