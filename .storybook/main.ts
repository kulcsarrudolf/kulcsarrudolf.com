import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y"],
  framework: {
    name: "@storybook/react-vite",
    options: {
      builder: {
        // The app's vite.config.ts wires up TanStack Start and Nitro, which
        // only make sense for the real server build. Storybook gets a
        // minimal config with just React and the `@/` path alias.
        viteConfigPath: ".storybook/vite.config.ts",
      },
    },
  },
  // Serves /images/*, /favicon/* and so on exactly like the site does.
  staticDirs: ["../public"],
  core: {
    disableTelemetry: true,
  },
};

export default config;
