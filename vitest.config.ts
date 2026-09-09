import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

// Vitest reads this file instead of vite.config.ts, so the TanStack Start and
// Nitro plugins stay out of the test run. Mirrors .storybook/vite.config.ts.
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    unstubEnvs: true,
  },
});
