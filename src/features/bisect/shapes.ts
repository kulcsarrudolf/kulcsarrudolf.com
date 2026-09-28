/**
 * The twenty shapes to cut, each a developer's icon drawn from circles, pen
 * strokes and polygons in a 100 by 100 box. The names are file names rather
 * than copy, so they read the same in every language.
 *
 * Most of them are lopsided on purpose: a shape with a mirror line hands the
 * player a perfect cut, so the few symmetric ones are turned off the axes.
 */

import type { Point, Ring } from "./geometry";
import {
  arc,
  chain,
  circle,
  cubic,
  ellipse,
  gear,
  hole,
  mirror,
  polygon,
  rect,
  ribbon,
  rotate,
  sparkle,
} from "./shapeKit";

export interface ShapeDefinition {
  /** The file name the shape is shown under. */
  id: string;
  /** Its rings in the authoring box, built only when the shape is played. */
  draw: () => Ring[];
}

/** A node on a git graph: a ring with its hole. */
const commit = (center: Point): Ring[] => [circle(center, 11), hole(circle(center, 5))];

/**
 * One slice of the database drum: the band between the front rims of two
 * stacked discs.
 */
const drumBand = (top: number, bottom: number): Ring => {
  const rim = (y: number, from: number, to: number) =>
    Array.from({ length: 33 }, (_, i): Point => {
      const t = ((from + ((to - from) * i) / 32) * Math.PI) / 180;
      return [50 + Math.cos(t) * 36, y + Math.sin(t) * 11];
    });
  return polygon([...rim(top, 180, 0), ...rim(bottom, 0, 180)]);
};

/** A point on the spinner's track, for the dots trailing into its gap. */
const spinnerDot = (angle: number): Point => [
  50 + 38 * Math.cos((angle * Math.PI) / 180),
  50 + 38 * Math.sin((angle * Math.PI) / 180),
];

export const SHAPES: readonly ShapeDefinition[] = [
  {
    id: "prompt",
    draw: () => [
      rect(4, 12, 92, 76, 10),
      hole(rect(10, 30, 80, 52, 5)),
      hole(circle([17, 21], 3)),
      hole(circle([26, 21], 3)),
      hole(circle([35, 21], 3)),
      ribbon(
        [
          [22, 42],
          [36, 54],
          [22, 66],
        ],
        7,
      ),
      ribbon(
        [
          [44, 68],
          [64, 68],
        ],
        7,
      ),
    ],
  },
  {
    id: "git-branch",
    draw: () => [
      ...commit([30, 16]),
      ...commit([30, 84]),
      ...commit([74, 38]),
      ribbon(
        [
          [30, 27],
          [30, 73],
        ],
        7,
      ),
      ribbon(cubic([74, 49], [74, 64], [30, 54], [30, 70]), 7),
    ],
  },
  {
    id: "react-atom",
    draw: () => [
      ...[0, 60, 120].flatMap((turn) => [
        ellipse([50, 50], 48, 18, turn),
        hole(ellipse([50, 50], 42, 12, turn)),
      ]),
      circle([50, 50], 8),
    ],
  },
  {
    id: "coffee",
    draw: () => [
      rect(12, 40, 58, 48, 10),
      ribbon(arc([70, 62], 13, -80, 80), 8),
      ribbon(cubic([30, 34], [22, 26], [38, 18], [30, 6]), 5),
      ribbon(cubic([48, 34], [40, 26], [56, 18], [48, 6]), 5),
    ],
  },
  {
    id: "bug",
    draw: () => {
      const legs = [
        ribbon(
          [
            [34, 50],
            [20, 44],
            [13, 34],
          ],
          4,
        ),
        ribbon(
          [
            [33, 61],
            [12, 62],
          ],
          4,
        ),
        ribbon(
          [
            [34, 72],
            [20, 80],
            [16, 91],
          ],
          4,
        ),
        ribbon(cubic([45, 22], [40, 12], [34, 8], [28, 8]), 3.5),
      ];
      return rotate(
        [
          ellipse([50, 60], 19, 25),
          circle([50, 30], 10),
          hole(rect(48.8, 42, 2.4, 40, 1.2)),
          ...legs,
          ...mirror(legs),
        ],
        18,
      );
    },
  },
  {
    id: "gears",
    draw: () => [
      gear([40, 58], 34, 27, 10),
      hole(circle([40, 58], 10)),
      gear([80.6, 23.9], 18, 12.5, 7, 12),
      hole(circle([80.6, 23.9], 5)),
    ],
  },
  {
    id: "floppy",
    draw: () => [
      polygon([
        [8, 8],
        [76, 8],
        [92, 24],
        [92, 92],
        [8, 92],
      ]),
      hole(rect(26, 14, 40, 26, 3)),
      rect(52, 18, 8, 18, 2),
      hole(rect(18, 54, 64, 32, 4)),
    ],
  },
  {
    id: "cloud",
    draw: () => [
      circle([32, 58], 19),
      circle([56, 42], 25),
      circle([78, 60], 16),
      rect(14, 56, 70, 20, 10),
    ],
  },
  {
    id: "database",
    draw: () => rotate([ellipse([50, 20], 36, 11), drumBand(27, 50), drumBand(57, 80)], -14),
  },
  {
    id: "hash-bang",
    draw: () => [
      ribbon(
        [
          [22, 88],
          [32, 12],
        ],
        8,
      ),
      ribbon(
        [
          [44, 88],
          [54, 12],
        ],
        8,
      ),
      ribbon(
        [
          [10, 36],
          [64, 36],
        ],
        8,
      ),
      ribbon(
        [
          [6, 64],
          [60, 64],
        ],
        8,
      ),
      ribbon(
        [
          [83, 12],
          [83, 62],
        ],
        10,
      ),
      circle([83, 84], 6.5),
    ],
  },
  {
    id: "lambda",
    draw: () => [
      ribbon(
        chain(cubic([16, 14], [28, 8], [36, 12], [42, 24]), [
          [78, 88],
          [88, 86],
        ]),
        12,
      ),
      ribbon(
        [
          [50, 46],
          [20, 90],
        ],
        12,
      ),
    ],
  },
  {
    id: "cursor",
    draw: () => [
      polygon([
        [22, 6],
        [22, 78],
        [39, 63],
        [51, 90],
        [63, 85],
        [51, 58],
        [74, 57],
      ]),
    ],
  },
  {
    id: "rocket",
    draw: () =>
      rotate(
        [
          polygon(
            chain(
              cubic([50, 4], [66, 18], [66, 44], [62, 68]),
              cubic([38, 68], [34, 44], [34, 18], [50, 4]),
            ),
          ),
          hole(circle([50, 34], 7)),
          polygon([
            [38, 46],
            [22, 70],
            [24, 78],
            [39, 66],
          ]),
          polygon([
            [62, 46],
            [78, 70],
            [76, 78],
            [61, 66],
          ]),
          polygon(
            chain(
              cubic([42, 72], [40, 82], [48, 88], [50, 98]),
              cubic([50, 98], [52, 88], [60, 82], [58, 72]),
            ),
          ),
        ],
        38,
      ),
  },
  {
    id: "whale",
    draw: () => {
      const containers = [
        ...[10, 22, 34, 46, 58].map((x) => rect(x, 39, 10, 9, 1.5)),
        ...[22, 34, 46].map((x) => rect(x, 28, 10, 9, 1.5)),
        rect(34, 17, 10, 9, 1.5),
      ];
      return [
        polygon(
          chain(
            [
              [4, 50],
              [80, 50],
            ],
            cubic([80, 50], [86, 44], [90, 36], [98, 34]),
            cubic([98, 34], [96, 44], [92, 50], [90, 56]),
            cubic([90, 56], [82, 80], [56, 90], [34, 88]),
            cubic([34, 88], [14, 86], [4, 70], [4, 52]),
          ),
        ),
        hole(circle([20, 62], 3)),
        ...containers,
      ];
    },
  },
  {
    id: "tux",
    draw: () =>
      rotate(
        [
          ellipse([50, 62], 25, 30),
          circle([50, 27], 16),
          hole(ellipse([44, 24], 3, 4.5)),
          hole(ellipse([56, 24], 3, 4.5)),
          hole(ellipse([50, 66], 13, 21)),
          ellipse([24, 60], 7, 20, 20),
          ellipse([76, 60], 7, 20, -20),
          ellipse([36, 94], 13, 6, -8),
          ellipse([64, 94], 13, 6, 8),
        ],
        10,
      ),
  },
  {
    id: "python",
    draw: () => [
      ribbon(
        chain(
          cubic([8, 84], [24, 96], [40, 78], [36, 60]),
          cubic([36, 60], [32, 42], [50, 30], [64, 40]),
          cubic([64, 40], [74, 48], [80, 34], [78, 24]),
        ),
        14,
      ),
      ellipse([80, 18], 12, 9, -30),
      hole(circle([84, 14], 2.2)),
      ribbon(
        [
          [88, 12],
          [97, 5],
        ],
        2.5,
      ),
    ],
  },
  {
    id: "sparkles",
    draw: () => [sparkle([40, 60], 36), sparkle([80, 22], 16), sparkle([82, 80], 9)],
  },
  {
    id: "spinner",
    draw: () => [
      ribbon(arc([50, 50], 38, -90, 180), 16),
      circle(spinnerDot(208), 5),
      circle(spinnerDot(236), 3.5),
    ],
  },
  {
    id: "less-than-three",
    draw: () => [
      ribbon(
        [
          [38, 26],
          [12, 50],
          [38, 74],
        ],
        11,
      ),
      ribbon(arc([66, 35], 14, -160, 100), 11),
      ribbon(arc([66, 64], 15, -100, 160), 11),
      ribbon(
        [
          [66, 49],
          [57, 49],
        ],
        11,
      ),
    ],
  },
  {
    id: "robot",
    draw: () =>
      rotate(
        [
          rect(18, 30, 64, 52, 12),
          hole(circle([37, 52], 7)),
          hole(circle([63, 52], 7)),
          hole(rect(34, 66, 32, 7, 3.5)),
          rect(8, 46, 12, 20, 4),
          rect(80, 46, 12, 20, 4),
          ribbon(chain(cubic([58, 31], [58, 20], [66, 16], [72, 12])), 5),
          circle([74, 10], 6),
        ],
        -8,
      ),
  },
];
