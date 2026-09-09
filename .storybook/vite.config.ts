import { fileURLToPath } from "node:url";

import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Vite config used only by Storybook. Tailwind runs through the same Vite
// plugin as the app. The `@/` alias is spelled out because Storybook's builder
// does not resolve it from tsconfig.json the way the app build does.
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("../src", import.meta.url)),
    },
  },
  plugins: [tailwindcss(), viteReact()],
});
