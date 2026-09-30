// Pure helpers for scripts/upload-image.ts: reading the credentials, signing
// an upload request, and turning an upload into the URL a post uses.

import { createHash } from "node:crypto";
import { basename, extname } from "node:path";

export interface CloudinaryCredentials {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
}

/**
 * Reads `cloudinary://<api_key>:<api_secret>@<cloud_name>`, the variable the
 * Cloudinary console shows as "API environment variable".
 */
export function parseCloudinaryUrl(value: string): CloudinaryCredentials {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error("CLOUDINARY_URL is not a URL; expected cloudinary://<key>:<secret>@<cloud>");
  }
  if (url.protocol !== "cloudinary:" || !url.username || !url.password || !url.hostname) {
    throw new Error("CLOUDINARY_URL must look like cloudinary://<key>:<secret>@<cloud>");
  }
  return {
    cloudName: url.hostname,
    apiKey: decodeURIComponent(url.username),
    apiSecret: decodeURIComponent(url.password),
  };
}

/**
 * Cloudinary's upload signature: the parameters sorted by name, joined as
 * `key=value&...`, with the API secret appended, hashed with SHA-1.
 * `file`, `api_key`, `resource_type` and `cloud_name` are never signed.
 */
export function signParams(params: Record<string, string>, apiSecret: string): string {
  const toSign = Object.keys(params)
    .filter((key) => params[key] !== "")
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  return createHash("sha1")
    .update(toSign + apiSecret)
    .digest("hex");
}

/** `Diamond System Diagram.png` becomes `diamond-system-diagram`. */
export function publicIdFromPath(path: string): string {
  const id = basename(path, extname(path))
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (id === "") {
    throw new Error(`Cannot make a public id from "${path}"; pass one with --id`);
  }
  return id;
}

/**
 * The upload's `secure_url` with `q_auto/f_auto` after `/upload/`, the form
 * the posts use, so each browser gets the smallest format it can show.
 */
export function deliveryUrl(secureUrl: string): string {
  return secureUrl.replace("/image/upload/", "/image/upload/q_auto/f_auto/");
}
