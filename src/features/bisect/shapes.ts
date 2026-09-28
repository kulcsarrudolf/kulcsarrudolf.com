/**
 * The forty shapes to cut, each drawn from circles, pen strokes and polygons
 * or traced from its outline: nineteen developer's icons and twenty-one logos
 * from a developer's toolbox. The names are file names rather than copy, so
 * they read the same in every language.
 *
 * Most of them are lopsided on purpose: a shape with a mirror line hands the
 * player a perfect cut, so the few symmetric ones are turned off the axes.
 * None may look the same turned half a turn, since then every line through
 * its middle would halve it.
 */

import type { Ring } from "./geometry";
import { ICON_SHAPES } from "./iconShapes";
import { LOGO_SHAPES } from "./logoShapes";

export interface ShapeDefinition {
  /** The file name the shape is shown under. */
  id: string;
  /** Its rings in the authoring box, built only when the shape is played. */
  draw: () => Ring[];
}

export const SHAPES: readonly ShapeDefinition[] = [...ICON_SHAPES, ...LOGO_SHAPES];
