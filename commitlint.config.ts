import type { UserConfig } from "@commitlint/types";

import { COMMIT_TYPES } from "./scripts/conventions.ts";

export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [2, "always", [...COMMIT_TYPES]],
    // Prose in a commit body is one sentence per line, and a sentence is often
    // longer than 100 characters. The subject keeps its limit.
    "body-max-line-length": [0],
    "footer-max-line-length": [0],
  },
} satisfies UserConfig;
