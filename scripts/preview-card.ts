// Renders one social preview card (the og:image behind a shared link) to PNG.
// satori lays the card out from React elements and inline styles and emits
// SVG; resvg rasterises that. Both run in plain Node, so this is a build step
// rather than a request handler: the deployed function never draws anything.

import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import { Resvg } from "@resvg/resvg-js";
import { createElement, type ReactNode } from "react";
import satori, { type Font } from "satori";

import { AUTHOR_NAME, OG_IMAGE_HEIGHT, OG_IMAGE_WIDTH } from "../src/config/site.ts";

export type PreviewCard = {
  title: string;
  subtitle?: string;
  /** Bottom-left caption, such as the post's date. */
  meta?: string;
};

// The theme's `brand` and `surface`, which the SVG has to carry as literals.
const BRAND = "#4267b2";
const SURFACE = "#e9ebee";
const TEXT = "#1f2937";
const TEXT_MUTED = "#4b5563";
const TEXT_FAINT = "#6b7280";

const DOMAIN = "kulcsarrudolf.com";
const LOGO = new URL("../public/images/me-logo.png", import.meta.url);

// Inter, in the same weights the site uses. Fontsource splits the font by
// script, and satori does not look past the first face of a family for a
// missing glyph, so the latin-ext subset is registered as a second family
// that the font stack falls through to. Hungarian titles need it.
const WEIGHTS = [400, 600, 700] as const;
const FONT_STACK = "Inter, InterExt";

const fontFile = (subset: string, weight: number): string =>
  fileURLToPath(
    import.meta.resolve(`@fontsource/inter/files/inter-${subset}-${weight}-normal.woff`),
  );

const loadFonts = (): Promise<Font[]> =>
  Promise.all(
    WEIGHTS.flatMap((weight) =>
      [
        { name: "Inter", subset: "latin" },
        { name: "InterExt", subset: "latin-ext" },
      ].map(async ({ name, subset }) => ({
        name,
        weight,
        style: "normal" as const,
        data: await readFile(fontFile(subset, weight)),
      })),
    ),
  );

const loadLogo = async (): Promise<string> =>
  `data:image/png;base64,${(await readFile(LOGO)).toString("base64")}`;

// Loaded once per process, however many cards are rendered.
let assets: Promise<{ fonts: Font[]; logo: string }> | undefined;
const loadAssets = () => {
  assets ??= Promise.all([loadFonts(), loadLogo()]).then(([fonts, logo]) => ({ fonts, logo }));
  return assets;
};

// A long title gets a smaller face rather than a fourth line.
const titleFontSize = (title: string): number => {
  if (title.length <= 40) {
    return 72;
  }
  return title.length <= 70 ? 60 : 52;
};

type Style = Record<string, string | number>;

const el = (tag: string, style: Style, ...children: ReactNode[]): ReactNode =>
  createElement(tag, { style }, ...children);

const layout = (card: PreviewCard, logo: string): ReactNode =>
  el(
    "div",
    {
      display: "flex",
      width: "100%",
      height: "100%",
      padding: 48,
      background: SURFACE,
      fontFamily: FONT_STACK,
      color: TEXT,
    },
    el(
      "div",
      {
        display: "flex",
        flexDirection: "column",
        flex: 1,
        background: "white",
        borderRadius: 24,
        overflow: "hidden",
      },
      // The navbar's brand bar, clipped by the card's corners.
      el("div", { height: 14, background: BRAND }),
      el(
        "div",
        {
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          flex: 1,
          padding: "44px 56px",
        },
        el(
          "div",
          { display: "flex", alignItems: "center", gap: 18 },
          createElement("img", {
            src: logo,
            width: 60,
            height: 60,
            style: { borderRadius: 9999, border: `3px solid ${BRAND}` },
          }),
          el("span", { fontSize: 26, fontWeight: 600 }, AUTHOR_NAME),
        ),
        el(
          "div",
          { display: "flex", flexDirection: "column", gap: 20 },
          el(
            "div",
            {
              fontSize: titleFontSize(card.title),
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: -1,
              lineClamp: 3,
            },
            card.title,
          ),
          ...(card.subtitle
            ? [
                el(
                  "div",
                  { fontSize: 30, lineHeight: 1.35, color: TEXT_MUTED, lineClamp: 2 },
                  card.subtitle,
                ),
              ]
            : []),
        ),
        el(
          "div",
          { display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 24 },
          el("span", { color: TEXT_FAINT }, card.meta ?? ""),
          el("span", { color: BRAND, fontWeight: 600 }, DOMAIN),
        ),
      ),
    ),
  );

export const renderPreviewCard = async (card: PreviewCard): Promise<Buffer> => {
  const { fonts, logo } = await loadAssets();

  const svg = await satori(layout(card, logo), {
    width: OG_IMAGE_WIDTH,
    height: OG_IMAGE_HEIGHT,
    fonts,
  });

  return new Resvg(svg).render().asPng();
};
