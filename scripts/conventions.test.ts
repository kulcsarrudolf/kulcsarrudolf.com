import { describe, expect, it } from "vitest";

import { COMMIT_TYPES, branchNameError } from "./conventions.ts";

describe("branchNameError", () => {
  it("refuses the branches work lands on through a pull request", () => {
    expect(branchNameError("develop")).toMatch(/pull request/);
    expect(branchNameError("master")).toMatch(/pull request/);
  });

  it.each(["chore/typescript-7", "fix/navbar-link-shift", "content/new-post", "feat/a"])(
    "accepts %s",
    (name) => {
      expect(branchNameError(name)).toBeNull();
    },
  );

  it("accepts the branches Dependabot names itself", () => {
    expect(branchNameError("dependabot/npm_and_yarn/x")).toBeNull();
  });

  it.each([
    "feature/x",
    "fixt/x",
    "chore/Typescript-7",
    "chore/typescript_7",
    "chore/",
    "chore/-x",
    "chore/x-",
    "chore/x--y",
    "typescript-7",
  ])("refuses %s", (name) => {
    expect(branchNameError(name)).toMatch(/<type>\/<kebab-case>/);
  });

  it("names the allowed types when the type is wrong", () => {
    const error = branchNameError("feature/x");
    for (const type of COMMIT_TYPES) {
      expect(error).toContain(type);
    }
  });
});
