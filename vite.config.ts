import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

import { HOST, HTTPS_PORT, httpsRedirect, readLocalCerts } from "./scripts/local-dev.ts";

// Sent with every response. The site is never meant to be framed, and nothing
// it opens in a new tab needs a handle back to it. A full Content-Security-
// Policy is left out for now: the theme script and the JSON-LD are inline, so
// one needs nonces threaded through the document first.
const SECURITY_HEADERS = {
  "X-Frame-Options": "DENY",
  "Cross-Origin-Opener-Policy": "same-origin",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
};

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
      // detects the provider automatically and emits the Build Output API,
      // which is also why the headers live here: Vercel does not apply the
      // `headers` of vercel.json to a Build Output API deployment.
      nitro({ routeRules: { "/**": { headers: SECURITY_HEADERS } } }),
      // The React plugin must come after the Start plugin.
      viteReact(),
      httpsRedirect(),
    ],
  };
});
