/**
 * The second half of the pictures: everyday things. The first half, signs and
 * symbols, is in `symbols.ts`. Both are drawn on the 32 by 32 grid that
 * `picture.ts` turns into pixels.
 */

import { circle, ellipse, line, type Picture, polygon, rect, star } from "./picture";

export const THINGS: Picture[] = [
  {
    id: "apple",
    shapes: [
      line([16, 11], [17.5, 3], 2, "m"),
      polygon(
        [
          [18, 6.5],
          [24, 2],
          [27.5, 3.5],
          [21.5, 8.5],
        ],
        "G",
      ),
      circle(11, 19, 10, "r"),
      circle(21, 19, 10, "r"),
      ellipse(8.5, 15.5, 2, 3.5, "w"),
    ],
  },
  {
    id: "clover",
    shapes: [
      line([16, 17], [21, 30.5], 2.5, "G"),
      circle(16, 8.5, 6.5, "G"),
      circle(8.5, 16.5, 6.5, "G"),
      circle(23.5, 16.5, 6.5, "G"),
      circle(16, 14.5, 4, "G"),
    ],
  },
  {
    id: "key",
    shapes: [
      rect(13, 14, 17, 4, "y", "k"),
      rect(22, 18, 3, 5, "y", "k"),
      rect(27, 18, 3, 4, "y", "k"),
      circle(8.5, 16, 6.5, "y", "k"),
      circle(8.5, 16, 3.4, "k"),
      circle(8.5, 16, 2.4, "."),
    ],
  },
  {
    id: "bell",
    shapes: [
      circle(16, 27, 2.6, "y", "k"),
      polygon(
        [
          [16, 4],
          [22, 7.5],
          [23, 18],
          [28.5, 24],
          [3.5, 24],
          [9, 18],
          [10, 7.5],
        ],
        "y",
        "k",
      ),
      circle(16, 3.5, 2, "y", "k"),
      ellipse(13, 13, 1.3, 4, "w"),
    ],
  },
  {
    id: "house",
    shapes: [
      rect(5, 15, 22, 14, "s", "k"),
      polygon(
        [
          [16, 2],
          [31, 15.5],
          [1, 15.5],
        ],
        "r",
      ),
      rect(18, 19.5, 5.5, 9.5, "m"),
      rect(8, 18.5, 6, 5, "b"),
    ],
  },
  {
    id: "tree",
    shapes: [rect(13.5, 20, 5, 10, "m"), circle(16, 12, 10.5, "G"), circle(13, 9, 4.5, "g")],
  },
  {
    id: "fish",
    shapes: [
      polygon(
        [
          [21, 16],
          [31, 6.5],
          [31, 25.5],
        ],
        "b",
      ),
      ellipse(13, 16, 11.5, 8, "b"),
      circle(8, 13.5, 2.3, "w"),
      circle(8, 13.5, 1.1, "k"),
    ],
  },
  {
    id: "cup",
    shapes: [
      line([9, 6], [10.5, 1], 1.2, "d"),
      line([14, 6], [15.5, 1], 1.2, "d"),
      ellipse(14, 28, 13, 2.8, "s", "k"),
      circle(23, 15, 5.5, "p", "k"),
      circle(23, 15, 2.5, "."),
      polygon(
        [
          [4, 7],
          [22, 7],
          [20, 27],
          [6, 27],
        ],
        "p",
        "k",
      ),
    ],
  },
  {
    id: "umbrella",
    shapes: [
      circle(16, 16, 14.5, "P"),
      rect(0, 16, 32, 16, "."),
      circle(5.5, 16.5, 3.6, "."),
      circle(12.8, 16.5, 3.6, "."),
      circle(20.2, 16.5, 3.6, "."),
      circle(27.5, 16.5, 3.6, "."),
      rect(15, 2, 2, 26, "k"),
      line([16, 27.5], [13, 30], 2, "k"),
      line([13, 30], [10.5, 27], 2, "k"),
    ],
  },
  {
    id: "flag",
    shapes: [
      polygon(
        [
          [6.5, 3],
          [29.5, 3],
          [24, 10],
          [29.5, 17],
          [6.5, 17],
        ],
        "b",
      ),
      rect(4, 2, 2.5, 27, "k"),
      rect(1, 28, 8.5, 3, "k"),
    ],
  },
  {
    id: "mushroom",
    shapes: [
      circle(16, 17, 14.5, "r"),
      rect(0, 17, 32, 15, "."),
      rect(10.5, 17, 11, 12, "w", "k"),
      circle(9.5, 11, 2.6, "w"),
      circle(19.5, 7.5, 2.2, "w"),
      circle(25, 13, 2.2, "w"),
      circle(15, 14, 1.8, "w"),
    ],
  },
  {
    id: "cherries",
    shapes: [
      line([9.5, 20], [19, 4], 1.6, "G"),
      line([22, 21], [19, 4], 1.6, "G"),
      polygon(
        [
          [19, 4],
          [27.5, 1.5],
          [25, 7],
        ],
        "G",
      ),
      circle(9, 23.5, 6.5, "r"),
      circle(22.5, 24, 6.5, "r"),
      circle(6.5, 21, 1.4, "w"),
      circle(20, 21.5, 1.4, "w"),
    ],
  },
  {
    id: "envelope",
    shapes: [
      rect(2, 7, 28, 19, "w", "k"),
      line([2.5, 7.5], [16, 18], 1.4, "k"),
      line([29.5, 7.5], [16, 18], 1.4, "k"),
    ],
  },
  {
    id: "floppy",
    shapes: [
      rect(3, 3, 26, 26, "k"),
      rect(7, 6, 7, 3, "w"),
      rect(27, 9, 2, 3, "w"),
      circle(16, 15, 3.6, "w"),
      rect(15, 21, 2.5, 5.5, "d"),
    ],
  },
  {
    id: "clock",
    shapes: [
      circle(16, 16, 14.5, "k"),
      circle(16, 16, 12.5, "w"),
      rect(15.2, 4.5, 1.6, 3, "k"),
      rect(15.2, 24.5, 1.6, 3, "k"),
      rect(4.5, 15.2, 3, 1.6, "k"),
      rect(24.5, 15.2, 3, 1.6, "k"),
      line([16, 16], [16, 8], 2, "k"),
      line([16, 16], [22, 19.5], 2, "k"),
      circle(16, 16, 1.8, "r"),
    ],
  },
  {
    id: "bomb",
    shapes: [
      line([22, 8], [27, 3], 1.5, "m"),
      polygon(star(4, 28, 3, 3.5, 1.2), "r"),
      circle(28, 3, 1, "y"),
      polygon(
        [
          [17.5, 7.5],
          [22.5, 4],
          [26, 9],
          [21, 12.5],
        ],
        "k",
      ),
      circle(14, 19, 11.5, "k"),
      ellipse(9.5, 14, 2, 3.5, "w"),
    ],
  },
];
