// Tailwind classes belong in a component under `src/components/` or
// `src/features/`. This rule holds that line for every other file, so a route
// or a page composes components instead of styling markup itself.
//
// Deciding whether `bg-surface` or `nav:hidden` is a Tailwind class is not
// something a regular expression can answer: the theme, the custom
// breakpoints and arbitrary values like `w-[13px]` all change the answer. So
// the rule asks Tailwind, through the same context the build uses. That means
// reaching past the public API, which is why `tailwindcss` is pinned to an
// exact version in package.json. If a future version moves these files the
// import throws and the lint run fails loudly, rather than quietly deciding
// nothing is Tailwind any more.

import { createRequire } from "node:module";

import twConfig from "../tailwind.config.js";

const require = createRequire(import.meta.url);
const resolveConfig = require("tailwindcss/resolveConfig");
const { createContext } = require("tailwindcss/lib/lib/setupContextUtils.js");
const { generateRules } = require("tailwindcss/lib/lib/generateRules.js");

const tailwindContext = createContext(resolveConfig(twConfig));

// `group` and `peer` are the two classes Tailwind understands but generates no
// CSS for: they mark an ancestor for `group-hover:` and friends to look at.
// Tailwind therefore answers "no" for them, and it is wrong.
const MARKERS = /^(group|peer)(\/|$)/;

const answers = new Map();

const isTailwind = (token) => {
  if (!answers.has(token)) {
    answers.set(
      token,
      MARKERS.test(token) || generateRules(new Set([token]), tailwindContext).length > 0,
    );
  }

  return answers.get(token);
};

// A `className` may hold classes this project defines itself, `hide-scrollbar`
// and `nav-label` among them. Those are not Tailwind and are left alone.
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
