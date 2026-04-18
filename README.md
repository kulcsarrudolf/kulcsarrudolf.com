# My Personal Blog and Portfolio

This is the source code for my personal website at [kulcsarrudolf.com](https://kulcsarrudolf.com). It serves as both a portfolio — showcasing my projects, focus areas, and experience — and a blog where I write about the things I'm learning and building.

## Links

- PROD: [https://kulcsarrudolf.com](https://kulcsarrudolf.com)
- DEV: [https://kulcsarrudolf.vercel.app](https://kulcsarrudolf.vercel.app)

## Project Scope

- **Portfolio**: projects page, current focus, and a short bio rendered from typed content under `src/`.
- **Blog**: Markdown-based posts stored in `src/posts/`, dynamically rendered with per-post metadata (title, date, cover image, etc.).
- **Internationalization**: UI is available in English and Hungarian. Translations live in `src/i18n/translations/` (`en.json`, `hu.json`).
- **Deployment**: hosted on Vercel — `master` deploys to production, `develop` deploys to the preview URL.

## Technologies Used

- **Next.js** — React framework used for routing, SSR, and static generation.
- **Tailwind CSS** — utility-first styling, paired with `@tailwindcss/typography` for prose formatting in posts.
- **TypeScript** — used across the codebase for type safety.
- **gray-matter** + **markdown-to-jsx** — parse Markdown frontmatter and render post content.
- **[zimme-zoom](https://www.npmjs.com/package/zimme-zoom)** — my own small library for click-to-zoom images, used on blog post images.
- **Font Awesome** (`@fortawesome/*`) — icons throughout the site.
- **Vercel Analytics** — lightweight traffic analytics.
- **react-responsive** — responsive layout helpers.

## Getting Started

This project uses Yarn (enforced via a `preinstall` check — npm/pnpm will fail).

1. Clone the repository: `git clone https://github.com/kulcsarrudolf/kulcsarrudolf.com.git`
2. Install dependencies: `yarn install`
3. Start the development server: `yarn dev`

Other scripts: `yarn build`, `yarn start`, `yarn lint`.

## Writing Blog Posts

Blog posts are written in Markdown and stored in `src/posts/`. To add a new post, create a Markdown file named `post-title.md` and fill in the frontmatter and content. Posts are rendered dynamically on the site. A template is available [here](./src/posts/tempate/template-post.md) to keep formatting consistent.

## Contributing

I welcome contributions and feedback from the community. If you find any issues or have suggestions for improvements, please feel free to submit a pull request or open an issue.

## License

This project is licensed under the [MIT License](LICENSE).
