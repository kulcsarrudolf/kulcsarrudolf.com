// Tailwind classes belong in a component under `src/components/` or
// `src/features/`. This rule holds that line for every other file, so a route
// or a page composes components instead of styling markup itself.
//
// Deciding whether `bg-surface` or `nav:hidden` is a Tailwind class is not
// something a regular expression can answer: the theme, the custom
// breakpoints and arbitrary values like `w-[13px]` all change the answer. So
// the rule asks Tailwind, through the same design system the build uses.

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { __unstable__loadDesignSystem } from "@tailwindcss/node";

// The design system is built from the same stylesheet the site loads, so the
// theme, the custom breakpoints and the project's own `@utility` classes all
// count. The function is marked unstable upstream (it is what the Tailwind
// language server and the Prettier plugin use), which is why `tailwindcss`
// and `@tailwindcss/node` are pinned to exact versions in package.json: a
// change in its shape fails the lint run loudly rather than quietly deciding
// nothing is Tailwind any more.
const stylesheet = resolve(dirname(fileURLToPath(import.meta.url)), "../src/styles/globals.css");
const designSystem = await __unstable__loadDesignSystem(readFileSync(stylesheet, "utf8"), {
  base: dirname(stylesheet),
});

// `group` and `peer` are the two classes Tailwind understands but generates no
// CSS for: they mark an ancestor for `group-hover:` and friends to look at.
// Tailwind therefore answers "no" for them, and it is wrong.
const MARKERS = /^(group|peer)(\/|$)/;

const answers = new Map();

const isTailwind = (token) => {
  if (!answers.has(token)) {
    const [css] = designSystem.candidatesToCss([token]);
    answers.set(token, MARKERS.test(token) || css !== null);
  }

  return answers.get(token);
};

// The project's own utilities (`hide-scrollbar`, `nav-label`) are declared
// with `@utility` in globals.css, so Tailwind knows them and they count too.
const tailwindIn = (value) => value.split(/\s+/).filter(Boolean).filter(isTailwind);

// `className="…"` and `className={"…"}` both reach here. `className={expr}`
// does not: a computed class list is not something this rule can read, and
// nothing in the codebase writes one.
const stringLiteral = (attributeValue) => {
  if (!attributeValue) {
    return null;
  }

  const node =
    attributeValue.type === "JSXExpressionContainer" ? attributeValue.expression : attributeValue;

  return node.type === "Literal" && typeof node.value === "string" ? node : null;
};

const rule = {
  create(context) {
    return {
      JSXAttribute(node) {
        const name = node.name?.name;

        // Inline styles are the obvious way around a blocked `className`, and
        // they are worse than the Tailwind they would replace.
        if (name === "style") {
          context.report({
            node,
            message:
              "Inline styles belong in a component under `src/components/` or `src/features/`.",
          });
          return;
        }

        if (name !== "className") {
          return;
        }

        const literal = stringLiteral(node.value);
        if (!literal) {
          return;
        }

        const found = tailwindIn(literal.value);
        if (found.length === 0) {
          return;
        }

        context.report({
          node: literal,
          message: `Tailwind belongs in a component under \`src/components/\` or \`src/features/\`: ${found.join(" ")}`,
        });
      },
    };
  },
};

export default {
  meta: { name: "boundary" },
  rules: { "no-tailwind": rule },
};
