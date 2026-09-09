---
title: "zimme-zoom"
subtitle: "React components for viewing, zooming and browsing images."
description: "zimme-zoom is a dependency-light React library with a zoomable photo viewer, a virtualized media grid, a gallery and a swipeable carousel."
keywords:
  - zimme-zoom
  - react image viewer
  - react photo viewer
  - image zoom
  - react gallery
  - react carousel
date: "2025-12-02"
updated: "2026-04-18"
order: 10
lang: "en"
github: "https://github.com/kulcsarrudolf/zimme-zoom"
npm: "https://www.npmjs.com/package/zimme-zoom"
website: "https://zimme-zoom.vercel.app"
tech:
  - React
  - TypeScript
schemaType: "SoftwareSourceCode"
featured: true
private: false
---

A collection of image related React components published as a single npm package. It started
because I wanted a photo viewer that felt right on touch devices without pulling in a heavy
dependency tree, and it now powers the images on this website.

## Features

- `PhotoViewer`: modal viewer with zoom, rotation, navigation, blurred backgrounds and SVG overlays
- `MediaGrid`: virtualized, month grouped grid with search, jump to month and infinite loading
- `Gallery`: grid based gallery that hands off to `PhotoViewer`
- `ImageCarousel`: swipeable carousel with lazy loading and gesture support
- `Image`: standalone image with loading state and fade in transition
- Keyboard shortcuts and accessibility support throughout
- No virtualization dependency, React only

## Install

```bash
yarn add zimme-zoom
```

## Links

Source on [GitHub](https://github.com/kulcsarrudolf/zimme-zoom), package on
[npm](https://www.npmjs.com/package/zimme-zoom), live demo at
[zimme-zoom.vercel.app](https://zimme-zoom.vercel.app).
