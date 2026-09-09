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

| Need | Use |
| --- | --- |
| A filled or outlined button, on a `<button>`, `<a>` or router `<Link>` | `components/general/Button` (`Button`, `buttonClasses`) |
| A centred dialog over a dimmed backdrop | `components/general/modal/Modal` |
| A text link with a leading or trailing arrow | `components/general/ArrowLink` |
| A quotation in a bordered card | `components/quote/QuoteCard` |
| The `[HU]` marker on Hungarian content | `components/general/LanguageBadge` |
| A labelled form input or textarea | `components/contact/FormField` |
| Headings and body copy | `components/general/typography` |

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

## Checks

Run all three before calling a change done:

```bash
yarn typecheck && yarn lint && yarn build
```
