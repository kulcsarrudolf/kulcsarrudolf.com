// The local hostname, ports and certificate paths the dev servers share. This
// is the one place they are spelled out: vite.config.ts, .storybook/main.ts and
// scripts/dev-setup.ts all import from here.

import { readFileSync } from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

import type { Plugin } from "vite";

export const HOST = "kulcsarrudolf.local";
export const HTTPS_PORT = 443;
export const HTTP_PORT = 80;

export const REPO_ROOT = fileURLToPath(new URL("..", import.meta.url));
export const CERT_DIR = path.join(REPO_ROOT, ".certs");
export const CERT_FILE = path.join(CERT_DIR, "cert.pem");
export const KEY_FILE = path.join(CERT_DIR, "key.pem");
export const ROOT_CA_FILE = path.join(CERT_DIR, "rootCA.pem");

// Everything the certificate answers for. `localhost` keeps https://localhost
// working, and the two loopback addresses let the container healthcheck fetch
// https://127.0.0.1 with certificate validation left on.
export const CERT_SANS = [HOST, "localhost", "127.0.0.1", "::1"];

export const SETUP_COMMAND = "yarn dev:setup";

export function readLocalCerts(): { cert: Buffer; key: Buffer } {
  try {
    return { cert: readFileSync(CERT_FILE), key: readFileSync(KEY_FILE) };
  } catch {
    throw new Error(
      [
        `The dev server serves https://${HOST} and needs a certificate in ${path.relative(REPO_ROOT, CERT_DIR)}/.`,
        `Run \`${SETUP_COMMAND}\` once to create it and to map ${HOST} to this machine.`,
      ].join("\n"),
    );
  }
}

function stripPort(hostHeader: string): string {
  // An IPv6 literal is bracketed, so the last colon is the port only when it
  // comes after the closing bracket or there are no brackets at all.
  const end = hostHeader.lastIndexOf("]");
  const colon = hostHeader.lastIndexOf(":");
  return colon > end ? hostHeader.slice(0, colon) : hostHeader;
}

// Answers plain http on port 80 with a redirect to the https server, so a
// typed hostname or a curl without a scheme lands on the right origin. It
// binds the same host Vite does, which is every interface: see the note on
// `server.host` in vite.config.ts.
export function httpsRedirect(): Plugin {
  return {
    name: "local-dev:https-redirect",
    apply: "serve",
    configureServer(server) {
      const redirect = http.createServer((req, res) => {
        const host = stripPort(req.headers.host ?? HOST);
        res.writeHead(308, { Location: `https://${host}${req.url ?? "/"}` });
        res.end();
      });
      const host =
        typeof server.config.server.host === "string" ? server.config.server.host : undefined;
      server.httpServer?.once("listening", () => {
        redirect.listen(HTTP_PORT, host);
      });
      server.httpServer?.once("close", () => {
        redirect.close();
      });
    },
  };
}
