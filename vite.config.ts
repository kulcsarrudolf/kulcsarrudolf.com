import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

import { HOST, HTTPS_PORT, httpsRedirect, readLocalCerts } from "./scripts/local-dev.ts";

// Every page is server-rendered at request time (no prerendering), so the
// `?lang=` query, the private-post preview on the dev server and the
// `Accept: text/markdown` negotiation all keep working in production.
export default defineConfig(({ command }) => {
  // The certificate only exists on a machine that ran `yarn dev:setup`, so it
  // is read for the dev server alone: `vite build` on CI and Vercel never
  // looks for it.
  const serve = command === "serve";

  return {
    server: {
      // Every interface, not loopback: macOS lets an unprivileged process bind
      // a port below 1024 only on the wildcard address, so binding ::1:443 is
      // refused with EACCES. The container needs the wildcard anyway for its
      // published ports. While `yarn dev` runs, the site is therefore reachable
      // from the local network as well.
      host: true,
      port: HTTPS_PORT,
      // A busy 443 is a second dev server; sliding to 444 would hide that.
      strictPort: true,
      // Vite checks the Host header only over plain http, since a rebound DNS
      // name cannot present this certificate. Listed anyway, so turning https
      // off would not turn the hostname into a 403.
      allowedHosts: [HOST],
      https: serve ? readLocalCerts() : undefined,
    },
    resolve: {
      tsconfigPaths: true,
    },
    plugins: [
      tailwindcss(),
      tanstackStart(),
      // Nitro builds the server for the platform it runs on. On Vercel it
      // detects the provider automatically and emits the Build Output API.
      nitro(),
      // The React plugin must come after the Start plugin.
      viteReact(),
      httpsRedirect(),
    ],
  };
});
