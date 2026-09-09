# Conventions

Rules for working in this repository.
The architecture, scripts and content workflow are documented in [README.md](./README.md).

## File size

No file may exceed **500 lines**.
`yarn lint` enforces this through oxlint's `max-lines` rule, so a file that grows past the limit fails the lint run.

When a file approaches the limit, split it along the seams it already has rather than raising the number:

- Pull the state machine and the effects into a `use*` hook next to the component.
- Pull each visually distinct block (a card, a toolbar, a row) into its own component file.
- Pull inline SVG icons into an `icons.tsx` beside the component that uses them.

## Reuse

Before writing markup, check whether one of these already covers it:

| Need                                                                   | Use                                                     |
| ---------------------------------------------------------------------- | ------------------------------------------------------- |
| A filled or outlined button, on a `<button>`, `<a>` or router `<Link>` | `components/general/Button` (`Button`, `buttonClasses`) |
| A centred dialog over a dimmed backdrop                                | `components/general/modal/Modal`                        |
| A text link with a leading or trailing arrow                           | `components/general/ArrowLink`                          |
| A quotation in a bordered card                                         | `components/quote/QuoteCard`                            |
| The `[HU]` marker on Hungarian content                                 | `components/general/LanguageBadge`                      |
| A labelled form input or textarea                                      | `components/contact/FormField`                          |
| Headings, body copy, a muted intro, small print                        | `components/general/typography`                         |
| A two-column grid of cards                                             | `components/general/CardGrid`                           |
| A rule between sections, with or without a label                       | `components/general/Divider`                            |
| The closing block under a page's content                               | `components/general/EndNote`                            |
| The frame a page sits in: the centred column and the card              | `components/layout/PageShell`                           |

## Where Tailwind lives

Tailwind classes only appear in files under `src/components/`.
Everywhere else (routes, pages, `lib`, `i18n`) composes components and passes them props, rather than styling markup itself.

`yarn lint` enforces this through `boundary/no-tailwind`, a local rule in [.oxlint/tailwind-boundary.js](./.oxlint/tailwind-boundary.js).
It reads each `className` string literal and asks Tailwind itself whether the classes in it are Tailwind's own, so the project's own classes (`hide-scrollbar`, `nav-label`) pass and `bg-surface` or `nav:hidden` do not.
Inline `style` is refused the same way, so it cannot become the side door out.

When a route or a page needs markup it does not have, the answer is a component, not a `className`:

| Instead of                                    | Write         |
| --------------------------------------------- | ------------- |
| `<div className="grid gap-6 sm:grid-cols-2">` | `<CardGrid>`  |
| `<hr className="my-6" />`                     | `<Divider />` |
| `<p className="text-gray-600 mb-6">`          | `<Lead>`      |

A rule with no way out is a rule that gets deleted the first time it blocks something urgent, so there is one:

```tsx
// oxlint-disable-next-line boundary/no-tailwind -- why this one has to stay
```

The reason is not optional, and there are none in the codebase today.

## Colour

Colours come from the Tailwind theme in `tailwind.config.js`, never from a hex literal in a component:
`brand`, `brand-active`, `brand-hover` and `surface`, as `text-brand`, `bg-brand`, `bg-surface` and so on.

The one exception is a colour that has to be interpolated into a gradient or an inline `style`, and those are named constants at the top of the file that needs them.

## Keeping the language across navigation

Internal links carry the visitor's `?lang`.
Call `useLangSearch()` from `@/i18n/useLangSearch` and spread the result into a router `<Link search={...}>`, rather than rebuilding the conditional each time.

## Storybook

Every component under `src/components/` has a `*.stories.tsx` next to it.
A new component file means a new story file in the same commit.

The one exception is `components/layout/RootDocument`, which renders `<html>` and `<body>`.
Storybook draws every story inside a document of its own, so a second one nested in it shows nothing worth looking at.
The part that can be looked at is `PageShell`, and that has a story.

## Formatting

`oxfmt` owns the formatting, so no discussion of it belongs in review.
`yarn install` installs a pre-commit hook that runs `oxlint --fix` and then `oxfmt` over the staged files and stages what they rewrite, so a commit is formatted whether or not anyone remembered.
It then runs `tsc --noEmit` over the whole project.
An unfixable lint error or a type error stops the commit.

Run `yarn format` by hand when you want the working tree formatted before then, and never hand-format around it.

## Checks

Run all three before calling a change done:

```bash
yarn typecheck && yarn lint && yarn build
```
