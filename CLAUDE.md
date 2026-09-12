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

## Layers

`src/` is arranged so that a file's folder says what may import it:

| Folder                               | Holds                                                                                                                            | May import from                                           |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| `routes/`                            | One file per URL: loader, `head`, and the page it renders. Convention-bound, stays thin                                          | anything                                                  |
| `pages/`                             | What a route renders, composed from features and components. No Tailwind                                                         | `features`, `components`, `i18n`, `types`, `config`       |
| `features/`                          | One folder per domain (blog, projects, contact, quotes, home, sudoku, easter-egg, wedding): its components, hooks, data, stories | `components`, `i18n`, `lib`, `types`, `config`, `content` |
| `components/`                        | Shared code only: `ui/` (primitives), `layout/` (the shell), `content/` (rendering posts and projects)                           | `i18n`, `lib`, `types`, `config`                          |
| `server/`                            | Reading the content and building the plain-text responses. Reached only from `routes/` and `start.ts`                            | `types`, `config`, `content`                              |
| `content/`                           | Everything authored: posts, projects, drafts, templates, quotes                                                                  | `types`                                                   |
| `i18n/`, `lib/`, `types/`, `config/` | Leaves                                                                                                                           | each other                                                |

A feature never imports another feature, and a component never imports a feature.
There are three exceptions, and adding a fourth means writing it down here:

- `components/layout/navbar/Brand` renders `features/easter-egg/WelcomeModal` once the avatar ring fills: the modal has to sit outside the brand link, so the wiring lives there.
- `features/easter-egg/WelcomeModal` renders a quote from `features/quotes` and opens `features/sudoku`, which is what the modal is for.
- `features/home/terminal-intro` reads the wedding date from `features/wedding/countdown` and opens `features/sudoku`, for the two commands `help` does not list.

Imports use `./` inside a folder and `@/` everywhere else.
A component file exports its component as the default; hooks, data and helpers export names only.

## Reuse

Before writing markup, check whether one of these already covers it:

| Need                                                                   | Use                                                |
| ---------------------------------------------------------------------- | -------------------------------------------------- |
| A filled or outlined button, on a `<button>`, `<a>` or router `<Link>` | `components/ui/Button` (`Button`, `buttonClasses`) |
| A centred dialog over a dimmed backdrop                                | `components/ui/modal/Modal`                        |
| A text link with a leading or trailing arrow                           | `components/ui/ArrowLink`                          |
| A quotation in a bordered card                                         | `features/quotes/QuoteCard`                        |
| The `[HU]` marker on Hungarian content                                 | `components/content/LanguageBadge`                 |
| A labelled form input or textarea                                      | `features/contact/FormField`                       |
| Headings, body copy, links, a muted intro, small print                 | `components/ui/typography`                         |
| A two-column grid of cards                                             | `components/ui/CardGrid`                           |
| A rule between sections, with or without a label                       | `components/ui/Divider`                            |
| The closing block under a page's content                               | `components/ui/EndNote`                            |
| The frame a page sits in: the centred column and the card              | `components/layout/PageShell`                      |

## Where Tailwind lives

Tailwind classes only appear in files under `src/components/` and `src/features/`.
Everywhere else (routes, pages, `server`, `lib`, `i18n`) composes components and passes them props, rather than styling markup itself.

`yarn lint` enforces this through `boundary/no-tailwind`, a local rule in [.oxlint/tailwind-boundary.js](./.oxlint/tailwind-boundary.js).
It reads each `className` string literal and asks Tailwind itself, loaded from `globals.css`, whether it knows the classes in it, so `bg-surface`, `nav:hidden` and the project's own `@utility` classes (`hide-scrollbar`, `nav-label`) are all refused and an unknown class passes.
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

Colours come from the `@theme` block in `src/styles/globals.css`, never from a hex literal in a component:
`brand`, `brand-active`, `brand-hover` and `surface`, as `text-brand`, `bg-brand`, `bg-surface` and so on.
The two navbar breakpoints, `socials` and `nav`, are declared there too.

The one exception is a colour that has to be interpolated into a gradient or an inline `style`, and those are named constants at the top of the file that needs them.

## Keeping the language across navigation

Internal links carry the visitor's `?lang`.
Call `useLangSearch()` from `@/i18n/useLangSearch` and spread the result into a router `<Link search={...}>`, rather than rebuilding the conditional each time.

## Storybook

Every component under `src/components/` and `src/features/` has a `*.stories.tsx` next to it, titled after its folder (`UI/Button`, `Layout/Navbar/Brand`, `Blog/PostedOn`), so the Storybook sidebar mirrors the tree.
A new component file means a new story file in the same commit.

Two files are exempt.
`components/layout/RootDocument` renders `<html>` and `<body>`; Storybook draws every story inside a document of its own, so a second one nested in it shows nothing worth looking at.
The part that can be looked at is `PageShell`, and that has a story.
`components/layout/SpeedInsights` renders nothing outside production.

## Commits and branches

A commit subject is `<type>(<scope>): <description>`, in the Conventional Commits shape: lowercase type, an optional scope in parentheses, a lowercase imperative description with no trailing period.
The types are `feat`, `fix`, `chore`, `refactor`, `docs`, `test`, `content`, `style`, `perf`, `ci`, `build` and `revert`.
`content` is the project's own: a change to a post, a project or other authored copy under `src/content/`.

A branch is `<type>/<kebab-case>` with the same types, such as `chore/typescript-7` or `fix/navbar-link-shift`.
Nothing is committed straight onto `develop` or `master`: work reaches `develop` through a pull request and `master` through `yarn deploy`.

Both rules are enforced, so a slip is caught rather than remembered.
The list of types lives once, in [scripts/conventions.ts](./scripts/conventions.ts); [commitlint.config.ts](./commitlint.config.ts) reads it for the `commit-msg` hook and `scripts/check-branch-name.ts` reads it for the `pre-commit` hook.
CI runs the same two checks over a pull request's title and head branch, because a squash-merge lands on `develop` with the pull request title as its subject.
So a pull request title follows the commit subject rule too.

## Formatting

`oxfmt` owns the formatting, so no discussion of it belongs in review.
`yarn install` installs a pre-commit hook that runs `oxlint --fix` and then `oxfmt` over the staged files and stages what they rewrite, so a commit is formatted whether or not anyone remembered.
It then runs `tsc --noEmit` over the whole project.
An unfixable lint error or a type error stops the commit.

Run `yarn format` by hand when you want the working tree formatted before then, and never hand-format around it.

## Tests

Pure modules (`server/`, `lib/`, `i18n/`, a feature's engine or data helpers) get a `*.test.ts` next to them, run by `yarn test`.
Components are covered by their stories, not by unit tests.

## Checks

Run all four before calling a change done:

```bash
yarn typecheck && yarn lint && yarn test && yarn build
```
