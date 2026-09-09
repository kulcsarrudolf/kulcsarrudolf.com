import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

// Every page is server-rendered at request time (no prerendering), so the
// `?lang=` query, the private-post preview on the dev server and the
// `Accept: text/markdown` negotiation all keep working in production.
export default defineConfig({
  server: {
    port: 3000,
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    tanstackStart(),
    // Nitro builds the server for the platform it runs on. On Vercel it
    // detects the provider automatically and emits the Build Output API.
    nitro(),
    // The React plugin must come after the Start plugin.
    viteReact(),
  ],
});
