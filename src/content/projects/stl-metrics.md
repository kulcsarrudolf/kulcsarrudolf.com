---
title: "STL Metrics"
subtitle: "Compute volume, area and watertightness from an STL mesh."
description: "A zero-dependency library for computing STL mesh metrics: volume, surface area, bounding box, center of mass and watertightness, in the browser and in Node."
keywords:
  - stl-metrics
  - stl volume
  - 3d mesh metrics
  - watertight mesh
  - 3d printing
  - stl parser
date: "2026-07-22"
updated: "2026-07-23"
order: 50
lang: "en"
github: "https://github.com/kulcsarrudolf/stl-metrics"
npm: "https://www.npmjs.com/package/stl-metrics"
tech:
  - TypeScript
  - Browser
  - Node.js
schemaType: "SoftwareSourceCode"
featured: true
private: false
---

A library for measuring STL meshes. Point it at a file and it returns volume, surface area,
bounding box, center of mass, triangle count and whether the mesh is watertight. It runs in the
browser as happily as in Node, which makes it useful for 3D printing tools that want to quote a
price before anything is uploaded to a server.

## Features

- Parses both binary and ASCII STL with a hand-written parser and no dependencies
- Volume, surface area, bounding box, center of mass, triangle count and watertightness
- Optional weight estimate from a density and a unit scale
- Accepts almost any input: `ArrayBuffer`, typed arrays, `Blob` or `File`, streams, or a Node file
  path
- Flags non-watertight or degenerate geometry through a `warnings` array instead of failing
- Optional off-main-thread worker, so a large mesh does not block the UI

## Install

```bash
npm install stl-metrics
```

```js
import { parseStl } from "stl-metrics";

const metrics = await parseStl(file, { worker: true, density: 1.24, unitScale: "mm" });
console.log(metrics.volume, metrics.isWatertight, metrics.weight);
```

## Links

Source on [GitHub](https://github.com/kulcsarrudolf/stl-metrics), package on
[npm](https://www.npmjs.com/package/stl-metrics).
