import { fileURLToPath } from "node:url";

import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Vite config used only by Storybook. PostCSS (Tailwind) is picked up from
// postcss.config.js at the project root, the same as in the app. The `@/`
// alias is spelled out because Storybook's builder does not resolve it from
// tsconfig.json the way the app build does.
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("../src", import.meta.url)),
    },
  },
  plugins: [viteReact()],
});
