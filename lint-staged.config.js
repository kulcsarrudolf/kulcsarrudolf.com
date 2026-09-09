// The hook runs these in order (`--concurrent false` in .husky/pre-commit), because
// the first two groups rewrite the files the third one reads.
export default {
  "*.{ts,tsx,js,jsx,mjs,cjs}": ["oxlint --fix --max-warnings=0", "oxfmt"],
  "*.{json,jsonc,css,md,yml,yaml}": ["oxfmt"],

  // `tsc` typechecks the project, not a list of files: passing it the staged paths
  // would make it ignore tsconfig.json. So this typechecks the working tree, and an
  // error in a file the commit does not touch stops it too. The glob still earns its
  // keep by skipping the run entirely for a commit that is only prose or CSS.
  "*.{ts,tsx,js,jsx,json}": () => "tsc --noEmit",
};
