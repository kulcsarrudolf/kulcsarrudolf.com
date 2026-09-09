import type { Decorator, Preview } from "@storybook/react-vite";
import { config as fontAwesomeConfig } from "@fortawesome/fontawesome-svg-core";
import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { createContext, useContext, useMemo, type ReactNode } from "react";

import "@/styles/globals.css";

// globals.css already includes Font Awesome's stylesheet (same as the app).
fontAwesomeConfig.autoAddCss = false;

// Components reach the router through hooks (useNavigate, useSearch,
// useLocation) and <Link>, so every story renders inside a real router
// backed by an in-memory history. The story itself is provided through a
// context rather than captured in the route definition so that arg changes
// from the Controls panel re-render it without rebuilding the router.
const StoryContext = createContext<ReactNode>(null);

const RouteStory = () => useContext(StoryContext);

function createStoryRouter(lang: string) {
  const rootRoute = createRootRoute({
    // Mirrors the root route of the app: `?lang=` is validated once and
    // read by useTranslation() through useSearch({ strict: false }).
    validateSearch: (search: Record<string, unknown>) =>
      typeof search.lang === "string" ? { lang: search.lang } : {},
    component: RouteStory,
  });

  // The root component never renders an <Outlet>, so these children exist
  // only so that every path a <Link> can point at resolves to a match.
  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    component: () => null,
  });
  const splatRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "$",
    component: () => null,
  });

  return createRouter({
    routeTree: rootRoute.addChildren([indexRoute, splatRoute]),
    history: createMemoryHistory({
      initialEntries: [`/?lang=${encodeURIComponent(lang)}`],
    }),
  });
}

function RouterDecorator({ lang, children }: { lang: string; children: ReactNode }) {
  const router = useMemo(() => createStoryRouter(lang), [lang]);

  return (
    <StoryContext.Provider value={children}>
      <RouterProvider router={router} />
    </StoryContext.Provider>
  );
}

const withRouter: Decorator = (Story, context) => (
  <RouterDecorator lang={String(context.globals.lang ?? "en")}>
    <Story />
  </RouterDecorator>
);

const preview: Preview = {
  decorators: [withRouter],
  globalTypes: {
    lang: {
      description: "UI language passed as the `?lang=` query parameter",
      toolbar: {
        title: "Language",
        icon: "globe",
        items: [
          { value: "en", title: "English" },
          { value: "hu", title: "Magyar" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    lang: "en",
    backgrounds: { value: "site" },
  },
  parameters: {
    backgrounds: {
      options: {
        site: { name: "Site", value: "#e9ebee" },
        white: { name: "White", value: "#ffffff" },
        navbar: { name: "Navbar blue", value: "#4267b2" },
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    options: {
      storySort: {
        order: [
          "Introduction",
          "Typography",
          "Layout",
          "General",
          "Navbar",
          "Footer",
          "Blog",
          "Projects",
          "Quote",
          "Contact",
          "Markdown",
          "Sudoku",
          "Pages",
          "Wedding",
        ],
      },
    },
  },
  tags: ["autodocs"],
};

export default preview;
