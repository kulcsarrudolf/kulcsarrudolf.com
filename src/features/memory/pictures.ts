import { NATURE } from "./nature";
import { PATTERNS } from "./patterns";
import type { Picture } from "./picture";
import { SYMBOLS } from "./symbols";
import { THINGS } from "./things";

/** Every picture a block can hide: enough for the thirty pairs of an expert board. */
export const PICTURES: readonly Picture[] = [...SYMBOLS, ...NATURE, ...THINGS, ...PATTERNS];
