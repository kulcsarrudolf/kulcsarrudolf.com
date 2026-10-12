/**
 * The pictures under the blocks are the ones the 1991 game showed: forty-eight
 * by thirty-six pixels in the sixteen colours of Windows 3.1, flat and bold,
 * filling the face of the block.
 *
 * Each one is written out pixel for pixel, one palette letter per pixel, as
 * recovered from the screenshots in Ionică Bizău's Memory Blocks
 * (https://github.com/IonicaBizau/memory-blocks), copyright (c) 2015-25
 * Ionică Bizău and released under the MIT License.
 */

export const PICTURE_WIDTH = 48;
export const PICTURE_HEIGHT = 36;

/**
 * The Windows 3.1 palette, by the letter each colour is written with. A `.`
 * is left unpainted, so the white of the block's face shows through.
 * Named here rather than in the theme because they are filled into an SVG,
 * not a class.
 */
export const PALETTE = {
  k: "#000000",
  m: "#800000",
  G: "#008000",
  o: "#808000",
  n: "#000080",
  P: "#800080",
  t: "#008080",
  d: "#808080",
  s: "#c0c0c0",
  r: "#ff0000",
  g: "#00ff00",
  y: "#ffff00",
  b: "#0000ff",
  p: "#ff00ff",
  c: "#00ffff",
  w: "#ffffff",
} as const satisfies Record<string, string>;

export interface Picture {
  id: string;
  /** One string per row of pixels, top to bottom, one palette letter or `.` per pixel. */
  rows: readonly string[];
}

/** The rows of a picture written as a block of text, one row per line, indentation ignored. */
export const pixels = (text: TemplateStringsArray): string[] =>
  text.raw[0]
    .split("\n")
    .map((row) => row.trim())
    .filter(Boolean);

/** One run of same-coloured pixels on a row, which is one `<rect>` to draw. */
export interface Run {
  x: number;
  y: number;
  width: number;
  fill: string;
}

/**
 * The picture as runs of colour, so a row of eight red pixels is one rectangle
 * rather than eight. What is left unpainted stays transparent.
 */
export function runsOf(picture: Picture): Run[] {
  const runs: Run[] = [];

  picture.rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const letter = row[x];
      let end = x + 1;
      while (row[end] === letter) end++;
      const fill: string | undefined = PALETTE[letter as keyof typeof PALETTE];
      if (fill) runs.push({ x, y, width: end - x, fill });
      x = end;
    }
  });

  return runs;
}
