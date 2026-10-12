/**
 * The first half of the pictures: signs and symbols. The other half, everyday
 * things, is in `things.ts`. Both are drawn on the 32 by 32 grid that
 * `picture.ts` turns into pixels.
 */

import { circle, ellipse, line, type Picture, polygon, rect, regular, star } from "./picture";

const rays = Array.from({ length: 8 }, (_, i) => {
  const angle = (i * Math.PI) / 4;
  const at = (r: number) => [16 + r * Math.cos(angle), 16 + r * Math.sin(angle)] as const;
  return line(at(11), at(15.5), 2.5, "r");
});

export const SYMBOLS: Picture[] = [
  {
    id: "heart",
    shapes: [
      circle(10.5, 11, 7.5, "r"),
      circle(21.5, 11, 7.5, "r"),
      polygon(
        [
          [3.2, 13.5],
          [28.8, 13.5],
          [16, 28.5],
        ],
        "r",
      ),
    ],
  },
  {
    id: "star",
    shapes: [polygon(star(5, 16, 17, 14.5, 5.8), "y", "k")],
  },
  {
    id: "stop",
    shapes: [polygon(regular(8, 16, 16, 15, Math.PI / 8), "r"), rect(6, 13, 20, 6, "w")],
  },
  {
    id: "arrow",
    shapes: [
      polygon(
        [
          [16, 1.5],
          [29.5, 16],
          [21, 16],
          [21, 30],
          [11, 30],
          [11, 16],
          [2.5, 16],
        ],
        "r",
      ),
    ],
  },
  {
    id: "smiley",
    shapes: [
      circle(16, 16, 14, "y", "k"),
      ellipse(16, 18, 8, 7, "k"),
      ellipse(16, 15.5, 8.6, 7, "y"),
      ellipse(11, 11.5, 2, 3, "k"),
      ellipse(21, 11.5, 2, 3, "k"),
    ],
  },
  {
    id: "diamond",
    shapes: [
      polygon(
        [
          [16, 1.5],
          [27, 16],
          [16, 30.5],
          [5, 16],
        ],
        "r",
      ),
    ],
  },
  {
    id: "spade",
    shapes: [
      polygon(
        [
          [16, 2],
          [28, 16],
          [4, 16],
        ],
        "k",
      ),
      circle(10, 18, 6, "k"),
      circle(22, 18, 6, "k"),
      polygon(
        [
          [16, 19],
          [20, 29.5],
          [12, 29.5],
        ],
        "k",
      ),
    ],
  },
  {
    id: "club",
    shapes: [
      circle(16, 8.5, 6.2, "k"),
      circle(8.8, 18, 6.2, "k"),
      circle(23.2, 18, 6.2, "k"),
      circle(16, 16, 4, "k"),
      polygon(
        [
          [16, 16],
          [20.5, 29.5],
          [11.5, 29.5],
        ],
        "k",
      ),
    ],
  },
  {
    id: "note",
    shapes: [
      ellipse(8.5, 25, 4.8, 3.6, "n"),
      ellipse(23.5, 22, 4.8, 3.6, "n"),
      rect(11, 6, 2.5, 19, "n"),
      rect(26, 3, 2.5, 19, "n"),
      polygon(
        [
          [11, 6],
          [28.5, 3],
          [28.5, 7.5],
          [11, 10.5],
        ],
        "n",
      ),
    ],
  },
  {
    id: "lightning",
    shapes: [
      polygon(
        [
          [19, 1.5],
          [6, 18],
          [14, 18],
          [9.5, 30.5],
          [26, 12],
          [17.5, 12],
          [23.5, 1.5],
        ],
        "y",
        "k",
      ),
    ],
  },
  {
    id: "moon",
    shapes: [circle(15, 16, 13.5, "n"), circle(21.5, 12, 11, ".")],
  },
  {
    id: "sun",
    shapes: [...rays, circle(16, 16, 9, "y", "k")],
  },
  {
    id: "drop",
    shapes: [
      polygon(
        [
          [16, 1.5],
          [25.6, 19],
          [6.4, 19],
        ],
        "b",
      ),
      circle(16, 20.5, 9.6, "b"),
      ellipse(11.5, 21, 1.8, 4, "c"),
    ],
  },
  {
    id: "gem",
    shapes: [
      polygon(
        [
          [9, 4],
          [23, 4],
          [30, 12],
          [16, 29],
          [2, 12],
        ],
        "c",
        "k",
      ),
      line([2, 12], [30, 12], 1, "t"),
      line([9, 4], [12, 12], 1, "t"),
      line([23, 4], [20, 12], 1, "t"),
      line([12, 12], [16, 29], 1, "t"),
      line([20, 12], [16, 29], 1, "t"),
    ],
  },
];
