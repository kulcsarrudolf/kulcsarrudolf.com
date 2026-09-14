---
title: "Exactly Print"
subtitle: "Upload an image, pick a size, print it exactly that size."
description: "A web tool that lays an image out on a sheet as a PDF at an exact size in millimetres, with bleed, crop marks, 100 mm rulers and per-printer calibration."
keywords:
  - print image at exact size
  - print to scale
  - crop marks
  - printer calibration
  - pdf
date: "2026-09-15"
order: 55
lang: "en"
github: "https://github.com/kulcsarrudolf/exactly-print"
tech:
  - Python
  - FastAPI
  - htmx
schemaType: "WebApplication"
featured: false
private: false
---

Printing an image at a real-world size is harder than it should be. The print dialog scales the
page without saying so, the image file carries no physical size of its own, and a hand cut needs a
line to follow. Exactly Print takes an image and a size in millimetres and produces a one-page PDF
with the image at that size, ready to print at 100% and cut.

## Features

- The image is placed by physical millimetres, not pixels. Give one side and the other follows
  from the image's proportions
- A 2 mm bleed past the cut line and crop marks in the corners, so a slightly off cut still shows
  image rather than paper
- Two 100 mm rulers, along the bottom and up the left edge, so a test print shows whether the
  printer scaled the page, and by how much in each direction
- Per-printer calibration: measure the rulers once, type in what they came out as, and every later
  page is pre-scaled to cancel the printer's own scaling
- Nothing is stored. The server holds the image only for the length of the request

## How it is built

FastAPI serves one page, an htmx preview and the PDF. Pillow reads the upload and draws the
preview. The PDF is written by hand: one page, one image, a few lines and a bit of Helvetica. The
geometry lives in a single pure module that both the preview and the PDF draw from, so the two
cannot disagree.

## Run it

```bash
docker compose up
```

## Links

Source on [GitHub](https://github.com/kulcsarrudolf/exactly-print).
