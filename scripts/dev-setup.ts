// Prepares this machine for https://kulcsarrudolf.local: installs mkcert,
// trusts its root CA, writes a certificate into .certs/ and maps the hostname
// to loopback in /etc/hosts. `--remove` takes the hosts lines and .certs/ away
// again and leaves the CA and the Homebrew packages, which other projects may
// share. Every step is idempotent and says whether it did anything.
//
// Runs as the user. mkcert asks for the password itself when it installs the
// CA, and the /etc/hosts write goes through `sudo cp`, so nothing else runs
// elevated.

import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";

import { withHostEntries, withoutHostEntries } from "./hosts-file.ts";
import {
  CERT_DIR,
  CERT_FILE,
  CERT_SANS,
  HOST,
  KEY_FILE,
  REPO_ROOT,
  ROOT_CA_FILE,
  SETUP_COMMAND,
} from "./local-dev.ts";

const HOSTS_FILE = "/etc/hosts";
const PACKAGES = ["mkcert", "nss"];

function run(command: string, args: string[]): void {
  try {
    execFileSync(command, args, { stdio: "inherit" });
  } catch (error) {
    // The command already printed why on stderr; a stack trace adds nothing.
    const status =
      typeof error === "object" && error !== null && "status" in error ? error.status : null;
    console.error(
      `\n${command} ${args.join(" ")} failed${typeof status === "number" ? ` with exit code ${status}` : ""}.`,
    );
    process.exit(typeof status === "number" ? status : 1);
  }
}

function capture(command: string, args: string[]): string {
  return execFileSync(command, args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
  }).trim();
}

function has(command: string): boolean {
  try {
    capture("which", [command]);
    return true;
  } catch {
    return false;
  }
}

function step(message: string): void {
  console.log(`\n→ ${message}`);
}

function relative(file: string): string {
  return path.relative(REPO_ROOT, file);
}

function installPackages(): void {
  step("Homebrew packages");
  if (!has("brew")) {
    console.error("Homebrew is not installed. Install it from https://brew.sh and run this again.");
    process.exit(1);
  }
  const missing = PACKAGES.filter((name) => {
    try {
      capture("brew", ["list", "--versions", name]);
      return false;
    } catch {
      return true;
    }
  });
  if (missing.length === 0) {
    console.log(`${PACKAGES.join(" and ")} are already installed.`);
    return;
  }
  run("brew", ["install", ...missing]);
}

function trustRootCa(): void {
  step("Root certificate authority");
  // mkcert prints "already installed" on its own when there is nothing to do.
  run("mkcert", ["-install"]);
}

function writeCertificate(): void {
  step(`Certificate in ${relative(CERT_DIR)}/`);
  mkdirSync(CERT_DIR, { recursive: true });
  if (existsSync(CERT_FILE) && existsSync(KEY_FILE)) {
    console.log(
      `${relative(CERT_FILE)} and ${relative(KEY_FILE)} already exist. Delete them to issue a new pair.`,
    );
  } else {
    run("mkcert", ["-cert-file", CERT_FILE, "-key-file", KEY_FILE, ...CERT_SANS]);
  }
  // The container reads this through NODE_EXTRA_CA_CERTS, so its healthcheck
  // can validate the certificate. Cheap enough to refresh every time.
  copyFileSync(path.join(capture("mkcert", ["-CAROOT"]), "rootCA.pem"), ROOT_CA_FILE);
  console.log(`Root CA copied to ${relative(ROOT_CA_FILE)}.`);
}

function updateHosts(transform: (content: string, host: string) => string): void {
  step(`${HOST} in ${HOSTS_FILE}`);
  const current = readFileSync(HOSTS_FILE, "utf8");
  const next = transform(current, HOST);
  if (next === current) {
    console.log(`${HOSTS_FILE} is already as it should be.`);
    return;
  }
  // Written to a temp file first, so sudo only has to copy: the edit itself
  // never runs with elevated rights.
  const staged = path.join(REPO_ROOT, ".hosts.tmp");
  writeFileSync(staged, next);
  try {
    console.log(`sudo is needed to write ${HOSTS_FILE}.`);
    run("sudo", ["cp", staged, HOSTS_FILE]);
  } finally {
    rmSync(staged, { force: true });
  }
  console.log(`${HOSTS_FILE} updated.`);
}

function setup(): void {
  installPackages();
  trustRootCa();
  writeCertificate();
  updateHosts(withHostEntries);
  console.log(`
Done. The dev servers now answer on:
  https://${HOST}        yarn dev, or yarn docker:dev
  http://${HOST}         redirects to https
  https://${HOST}:6006   yarn storybook, or yarn docker:storybook

Undo with \`${SETUP_COMMAND} --remove\`.`);
}

function remove(): void {
  updateHosts(withoutHostEntries);
  step(`${relative(CERT_DIR)}/`);
  if (existsSync(CERT_DIR)) {
    rmSync(CERT_DIR, { recursive: true });
    console.log("Deleted.");
  } else {
    console.log("Already gone.");
  }
  console.log(`
Done. The mkcert root CA and the ${PACKAGES.join(" and ")} packages were left in place, since other projects may use them.
\`mkcert -uninstall\` and \`brew uninstall ${PACKAGES.join(" ")}\` remove those.`);
}

if (process.platform !== "darwin") {
  console.error(
    `${SETUP_COMMAND} supports macOS only: it relies on Homebrew and on ${HOSTS_FILE}.`,
  );
  process.exit(1);
}

const args = process.argv.slice(2);
if (args.length === 0) {
  setup();
} else if (args.length === 1 && args[0] === "--remove") {
  remove();
} else {
  console.error(`Usage: ${SETUP_COMMAND} [--remove]`);
  process.exit(1);
}
