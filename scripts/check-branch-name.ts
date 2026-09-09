// Refuses a commit on a branch whose name does not follow the convention in
// ./conventions.ts. The pre-commit hook runs it without arguments, on the
// current branch; CI passes the pull request's head branch as the argument.

import { execFileSync } from "node:child_process";

import { branchNameError } from "./conventions.ts";

function currentBranch(): string | null {
  try {
    return execFileSync("git", ["symbolic-ref", "--short", "HEAD"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    // A detached HEAD (mid-rebase, for instance) has no branch to judge.
    return null;
  }
}

const branch = process.argv[2] ?? currentBranch();

if (branch !== null) {
  const error = branchNameError(branch);
  if (error !== null) {
    console.error(error);
    process.exit(1);
  }
}
