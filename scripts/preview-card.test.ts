import { describe, expect, it } from "vitest";

import { OG_IMAGE_HEIGHT, OG_IMAGE_WIDTH } from "../src/config/site.ts";

import { renderPreviewCard } from "./preview-card.ts";

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

// The IHDR chunk follows the signature: width and height are its first two fields.
const pngSize = (png: Buffer) => ({ width: png.readUInt32BE(16), height: png.readUInt32BE(20) });

describe("renderPreviewCard", () => {
  it("renders a PNG at the Open Graph size", { timeout: 20_000 }, async () => {
    const png = await renderPreviewCard({
      title: "Migrating This Site from Next.js to TanStack Start",
      subtitle: "Same URLs, same server-side rendering, no Next.js",
      meta: "2026-06-05",
    });

    expect(png.subarray(0, PNG_SIGNATURE.length)).toEqual(PNG_SIGNATURE);
    expect(pngSize(png)).toEqual({ width: OG_IMAGE_WIDTH, height: OG_IMAGE_HEIGHT });
  });

  // Inter has no CJK glyphs, so that title is drawn with the font's
  // missing-glyph box. A Hungarian title that came out identical would mean
  // the latin-ext fallback is not wired up.
  it("draws Hungarian letters rather than a missing-glyph box", { timeout: 20_000 }, async () => {
    const accented = await renderPreviewCard({ title: "Kőszikla" });
    const missing = await renderPreviewCard({ title: "K漢szikla" });

    expect(accented.equals(missing)).toBe(false);
  });
});
