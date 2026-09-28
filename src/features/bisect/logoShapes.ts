/**
 * The other twenty-one shapes: logos from a developer's toolbox, each boiled
 * down to one flat silhouette. Letters are cut out of a solid as single
 * strokes, since two holes that overlap would fill each other back in. The
 * logos that do not survive being redrawn from circles and strokes are traced
 * from the outlines Font Awesome ships.
 */

import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faAngular,
  faGithub,
  faHtml5,
  faPostgresql,
  faSwift,
  faVuejs,
} from "@fortawesome/free-brands-svg-icons";

import type { Point, Ring } from "./geometry";
import { arc, chain, circle, cubic, hole, polygon, rect, ribbon, rotate } from "./shapeKit";
import type { ShapeDefinition } from "./shapes";
import { outline } from "./svgPath";

const RADIANS = Math.PI / 180;

/** Points from a flat run of coordinates, `x, y, x, y, …`. */
const at = (...xy: number[]): Point[] =>
  Array.from({ length: xy.length / 2 }, (_, i): Point => [xy[i * 2], xy[i * 2 + 1]]);

const polar = ([cx, cy]: Point, radius: number, angle: number): Point => [
  cx + Math.cos(angle * RADIANS) * radius,
  cy + Math.sin(angle * RADIANS) * radius,
];

/** A regular polygon with `sides` corners on a circle of `radius`. */
const regular = (center: Point, radius: number, sides: number, phase = -90): Point[] =>
  Array.from({ length: sides }, (_, i) => polar(center, radius, phase + (i * 360) / sides));

/** A stroke from `from`, `length` long, heading `angle` degrees. */
const bar = (from: Point, angle: number, length: number, width: number): Ring =>
  ribbon([from, polar(from, length, angle)], width);

/**
 * A stroke between two circles of `radius`, stopping `gap` short of each so
 * that, cut out as holes, the three never overlap.
 */
const link = (a: Point, b: Point, radius: number, width: number, gap = 1): Ring => {
  const length = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const angle = Math.atan2(b[1] - a[1], b[0] - a[0]) / RADIANS;
  const inset = radius + gap + width / 2;
  return bar(polar(a, inset, angle), angle, length - inset * 2, width);
};

/** An S as one stroke: a bowl turning left above one turning right. */
const letterS = ([x, y]: Point, radius: number, width: number): Ring =>
  ribbon(chain(arc([x, y], radius, -20, -270), arc([x, y + radius * 2], radius, -90, 160)), width);

/** One ring of the Chrome logo: a third of the band round the middle. */
const chromeSegment = (start: number): Ring => {
  const inner = 20;
  const outer = 46;
  // The dividing line leaves the inner circle at a tangent.
  const sweep = Math.atan(Math.sqrt(outer * outer - inner * inner) / inner) / RADIANS;
  const gap = 4;
  return polygon([
    polar([50, 50], inner, start + gap / 2),
    ...arc([50, 50], outer, start + sweep + gap, start + sweep + 120 - gap),
    ...arc([50, 50], inner, start + 120 - gap / 2, start + gap / 2),
  ]);
};

/** A Terraform block: a parallelogram whose right side sits `lift` lower. */
const block = (x: number, y: number, lift: number): Ring =>
  polygon(at(x, y, x + 22, y + lift, x + 22, y + lift + 26, x, y + 26));

/** A Font Awesome icon's outline, scaled to the 100-high authoring box. */
const traced = ({ icon: [, height, , , path] }: IconDefinition): Ring[] =>
  outline([path].flat().join(""), 100 / height);

/** Points drawn on a 24 by 24 grid, brought up to the authoring box. */
const onGrid = (...xy: number[]): Point[] => at(...xy.map((value) => (value * 100) / 24));

export const LOGO_SHAPES: readonly ShapeDefinition[] = [
  {
    id: "apple",
    draw: () => [
      polygon(
        chain(
          cubic([50, 31], [60, 24], [82, 22], [88, 42]),
          cubic([88, 42], [76, 46], [76, 62], [90, 68]),
          cubic([90, 68], [86, 82], [76, 96], [66, 96]),
          cubic([66, 96], [58, 96], [56, 92], [50, 92]),
          cubic([50, 92], [44, 92], [42, 96], [34, 96]),
          cubic([34, 96], [20, 96], [8, 74], [8, 58]),
          cubic([8, 58], [8, 36], [24, 26], [36, 28]),
          cubic([36, 28], [42, 29], [46, 31], [50, 31]),
        ),
      ),
      polygon(
        chain(
          cubic([50, 24], [50, 14], [56, 8], [66, 5]),
          cubic([66, 5], [66, 16], [58, 22], [50, 24]),
        ),
      ),
    ],
  },
  {
    id: "vscode",
    draw: () =>
      rotate(
        [
          polygon(
            chain(
              onGrid(24, 3.94, 23.15, 2.59, 18.21, 0.21, 16.5, 0.5, 7.05, 9.13, 2.93, 6),
              onGrid(1.65, 6.06, 0.33, 7.26, 0.33, 8.74, 3.9, 12, 0.33, 15.26, 0.33, 16.74),
              onGrid(1.65, 17.94, 2.93, 18, 7.05, 14.87, 16.5, 23.5, 18.21, 23.79),
              onGrid(23.15, 21.41, 24, 20.06),
            ),
          ),
          hole(polygon(onGrid(18, 6.55, 18, 17.45, 10.83, 12))),
        ],
        -12,
      ),
  },
  {
    id: "aws",
    draw: () => [
      circle([19, 38], 8),
      hole(circle([19, 38], 3.5)),
      ribbon(at(13, 22, 23, 21, 29, 26, 29, 46), 6),
      ribbon(at(36, 22, 43, 46, 51, 28, 59, 46, 66, 22), 6),
      letterS([81, 28], 6, 6),
      ribbon(cubic([10, 62], [34, 80], [62, 80], [84, 64]), 7),
      polygon(at(76, 58, 95, 55, 90, 73)),
    ],
  },
  { id: "postgres", draw: () => traced(faPostgresql) },
  {
    id: "typescript",
    draw: () => [
      rect(6, 6, 88, 88, 8),
      hole(polygon(at(36, 50, 62, 50, 62, 58, 53, 58, 53, 86, 45, 86, 45, 58, 36, 58))),
      hole(letterS([76, 60], 7, 7)),
    ],
  },
  {
    id: "javascript",
    draw: () => [
      rect(6, 6, 88, 88, 8),
      hole(ribbon(chain(at(54, 52, 54, 74), arc([46, 74], 8, 0, 150)), 7)),
      hole(letterS([76, 60], 7, 7)),
    ],
  },
  { id: "html5", draw: () => traced(faHtml5) },
  { id: "github", draw: () => rotate(traced(faGithub), 8) },
  {
    id: "kubernetes",
    draw: () => {
      const spokes = regular([50, 50], 38, 7, 12).map((tip) => ribbon([[50, 50], tip], 6));
      return [
        polygon(regular([50, 50], 47, 7, 12 - 90 / 7)),
        hole(circle([50, 50], 36)),
        circle([50, 50], 28),
        hole(circle([50, 50], 22)),
        ...spokes,
        circle([50, 50], 9),
      ];
    },
  },
  {
    id: "figma",
    draw: () => [
      polygon(chain(at(49, 14, 49, 36), arc([38, 25], 11, 90, 270))),
      polygon(chain(at(51, 36, 51, 14), arc([62, 25], 11, -90, 90))),
      polygon(chain(at(49, 38, 49, 60), arc([38, 49], 11, 90, 270))),
      circle([62, 49], 11),
      polygon(chain(at(49, 62, 49, 73), arc([38, 73], 11, 0, 270))),
    ],
  },
  {
    id: "android",
    draw: () =>
      rotate(
        [
          polygon(arc([50, 50], 30, 180, 360)),
          hole(circle([38, 38], 3.5)),
          hole(circle([62, 38], 3.5)),
          ribbon(at(38, 24, 31, 12), 4),
          ribbon(at(62, 24, 69, 12), 4),
          rect(20, 54, 60, 32, 6),
          rect(6, 54, 11, 28, 5.5),
          rect(83, 54, 11, 28, 5.5),
          rect(32, 82, 10, 14, 5),
          rect(58, 82, 10, 14, 5),
        ],
        12,
      ),
  },
  {
    id: "git",
    draw: () => {
      const top: Point = [38, 30];
      const bottom: Point = [38, 70];
      const side: Point = [66, 48];
      return [
        ...rotate([rect(18, 18, 64, 64, 10)], 45),
        ...[top, bottom, side].map((node) => hole(circle(node, 6))),
        hole(link(top, bottom, 6, 5)),
        hole(link(top, side, 6, 5)),
      ];
    },
  },
  {
    id: "terraform",
    draw: () => [block(8, 6, 12), block(34, 20, 12), block(34, 50, 12), block(60, 34, -12)],
  },
  {
    id: "graphql",
    draw: () => {
      const corners = regular([50, 50], 44, 6);
      const edges = corners.map((corner, i) => ribbon([corner, corners[(i + 1) % 6]], 3.5));
      const triangle = [0, 2, 4].map((i) => ribbon([corners[i], corners[(i + 2) % 6]], 3.5));
      return rotate([...edges, ...triangle, ...corners.map((corner) => circle(corner, 6))], 7);
    },
  },
  {
    id: "firebase",
    draw: () => [
      polygon(
        chain(
          cubic([50, 96], [24, 96], [12, 76], [18, 56]),
          cubic([18, 56], [24, 38], [40, 32], [38, 6]),
          cubic([38, 6], [62, 22], [72, 40], [66, 58]),
          cubic([66, 58], [72, 52], [76, 46], [76, 38]),
          cubic([76, 38], [90, 56], [88, 96], [50, 96]),
        ),
      ),
    ],
  },
  {
    id: "chrome",
    draw: () => [...[0, 120, 240].map((start) => chromeSegment(start + 30)), circle([50, 50], 15)],
  },
  {
    id: "stack-overflow",
    draw: () => [
      ribbon(at(14, 56, 14, 92, 80, 92, 80, 56), 8),
      ...[0, 10, 21, 33, 46].map((turn, i) => bar([27 + i * 5, 80 - i * 11], -turn, 34, 7)),
    ],
  },
  {
    id: "mongodb",
    draw: () =>
      rotate(
        [
          polygon(
            chain(
              cubic([50, 4], [74, 24], [76, 62], [52, 86]),
              cubic([52, 86], [28, 62], [26, 24], [50, 4]),
            ),
          ),
          ribbon(at(51, 78, 50, 96), 4),
        ],
        14,
      ),
  },
  { id: "vue", draw: () => rotate(traced(faVuejs), -10) },
  { id: "angular", draw: () => rotate(traced(faAngular), 9) },
  { id: "swift", draw: () => traced(faSwift) },
];
