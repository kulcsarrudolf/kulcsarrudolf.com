import type { StorybookConfig } from "@storybook/react-vite";

import { HOST } from "../scripts/local-dev.ts";

const config: StorybookConfig = {
  stories: ["./Introduction.mdx", "../src/**/*.stories.@(ts|tsx)"],
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
    // Storybook checks the Host header the way Vite does, and only localhost
    // and IP addresses pass by default.
    allowedHosts: [HOST],
  },
};

export default config;
