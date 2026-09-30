// The commit types the project uses, and the shape of a branch name built
// from them. The commitlint config and the pre-commit branch check both read
// this file, so a type added here is accepted in both places at once.
//
// The list is Conventional Commits plus `content`, which marks a change to a
// post, a project or other authored copy under `src/content/`.

export const COMMIT_TYPES = [
  "feat",
  "fix",
  "chore",
  "refactor",
  "docs",
  "test",
  "content",
  "style",
  "perf",
  "ci",
  "build",
  "revert",
] as const;

// Work never lands on these directly: it arrives through a pull request into
// `develop`, and `yarn deploy` fast-forwards `master` to it.
const PROTECTED_BRANCHES = ["develop", "master"];

// Dependabot names its own branches, and CI runs this check on its pull
// requests too.
const BOT_PREFIXES = ["dependabot/"];

const BRANCH_PATTERN = new RegExp(`^(${COMMIT_TYPES.join("|")})/[a-z0-9]+(-[a-z0-9]+)*$`);

// The reason a branch name is refused, or `null` when it is fine.
export function branchNameError(name: string): string | null {
  if (PROTECTED_BRANCHES.includes(name)) {
    return `Commits do not go straight onto ${name}. Commit on a branch and open a pull request.`;
  }
  if (BOT_PREFIXES.some((prefix) => name.startsWith(prefix))) {
    return null;
  }
  if (BRANCH_PATTERN.test(name)) {
    return null;
  }
  return [
    `Branch name "${name}" does not match <type>/<kebab-case>, for example chore/typescript-7.`,
    `Allowed types: ${COMMIT_TYPES.join(", ")}.`,
  ].join("\n");
}
