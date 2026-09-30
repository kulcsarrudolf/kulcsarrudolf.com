// Uploads images to Cloudinary and prints the URL and the <PostImage> line to
// paste into a post or a project.
//
//   yarn upload-image <file>... [--folder <name>] [--id <public id>]
//
// The credentials come from CLOUDINARY_URL, read from the environment or from
// .env.local. An image whose public id is already taken is left alone rather
// than overwritten, and the script says so.

import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { basename } from "node:path";
import { parseArgs } from "node:util";

import { deliveryUrl, parseCloudinaryUrl, publicIdFromPath, signParams } from "./cloudinary.ts";

interface UploadResult {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  bytes: number;
  existing?: boolean;
}

const { values, positionals: files } = parseArgs({
  allowPositionals: true,
  options: {
    folder: { type: "string" },
    id: { type: "string" },
  },
});

if (files.length === 0) {
  console.error("Usage: yarn upload-image <file>... [--folder <name>] [--id <public id>]");
  process.exit(1);
}
if (values.id && files.length > 1) {
  console.error("--id names a single image; upload one file at a time to use it.");
  process.exit(1);
}

for (const envFile of [".env.local", ".env"]) {
  if (!process.env.CLOUDINARY_URL && existsSync(envFile)) process.loadEnvFile(envFile);
}
if (!process.env.CLOUDINARY_URL) {
  console.error(
    "CLOUDINARY_URL is not set. Copy the API environment variable from the Cloudinary console into .env.local.",
  );
  process.exit(1);
}
const credentials = parseCloudinaryUrl(process.env.CLOUDINARY_URL);

async function upload(path: string): Promise<UploadResult> {
  const id = values.id ?? publicIdFromPath(path);
  // The folder goes into the public id rather than the `folder` parameter,
  // which accounts in dynamic folder mode leave out of the URL.
  const params: Record<string, string> = {
    public_id: values.folder ? `${values.folder.replace(/^\/+|\/+$/g, "")}/${id}` : id,
    overwrite: "false",
    timestamp: String(Math.floor(Date.now() / 1000)),
  };

  const form = new FormData();
  form.append("file", new Blob([await readFile(path)]), basename(path));
  for (const [key, value] of Object.entries(params)) form.append(key, value);
  form.append("api_key", credentials.apiKey);
  form.append("signature", signParams(params, credentials.apiSecret));

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${credentials.cloudName}/image/upload`,
    { method: "POST", body: form },
  );
  const body = (await response.json()) as UploadResult & { error?: { message: string } };
  if (!response.ok) {
    throw new Error(body.error?.message ?? `HTTP ${response.status}`);
  }
  return body;
}

let failed = false;

for (const path of files) {
  if (!existsSync(path)) {
    console.error(`✗ ${path}: no such file`);
    failed = true;
    continue;
  }
  try {
    const result = await upload(path);
    const url = deliveryUrl(result.secure_url);
    const size = `${result.width}x${result.height}, ${Math.round(result.bytes / 1024)} KB`;
    if (result.existing) {
      console.log(`! ${path}: "${result.public_id}" already exists and was not replaced (${size})`);
    } else {
      console.log(`✓ ${path} (${size})`);
    }
    console.log(`  ${url}`);
    console.log(`  <PostImage src="${url}" alt="" />`);
  } catch (error) {
    console.error(`✗ ${path}: ${error instanceof Error ? error.message : String(error)}`);
    failed = true;
  }
}

process.exit(failed ? 1 : 0);
