# Uploading images

Images for posts and projects are hosted on Cloudinary, not in the repo.
`yarn upload-image` uploads them and prints the line to paste into the Markdown.

## Setup

The script needs one variable, `CLOUDINARY_URL`, which holds the cloud name and the API key and secret together.

1. Open the [Cloudinary console](https://console.cloudinary.com) and go to **Settings**, then **API Keys**.
2. Copy the **API environment variable**. It looks like `cloudinary://<api_key>:<api_secret>@dialh0kqy`.
3. Put it in `.env.local` at the root of the repo:

   ```
   CLOUDINARY_URL=cloudinary://<api_key>:<api_secret>@dialh0kqy
   ```

`.env.local` is ignored by git, so the secret stays on your machine.
The script reads `.env.local` first and then `.env`, and a `CLOUDINARY_URL` already set in the shell wins over both.
The site itself never reads the variable, so it does not need to be set on Vercel.

## Uploading

```bash
yarn upload-image ~/Desktop/diagram.png
```

For every file it prints a status line, the image URL, and a `<PostImage>` line:

```
✓ /Users/you/Desktop/diagram.png (4116x3895, 504 KB)
  https://res.cloudinary.com/dialh0kqy/image/upload/q_auto/f_auto/v1790790813/diagram.png
  <PostImage src="https://res.cloudinary.com/dialh0kqy/image/upload/q_auto/f_auto/v1790790813/diagram.png" alt="" />
```

Paste the last line into the post or project and fill in `alt`.
Add `variant="diagram"` for a drawing that needs the full column to stay readable, and `title` for a caption in the zoom viewer:

```md
<PostImage variant="diagram" src="..." alt="What the diagram shows" title="Caption in the viewer" />
```

The URL carries `q_auto/f_auto`, so Cloudinary picks the quality and serves each browser the smallest format it supports (AVIF or WebP instead of a PNG, for example).

Several files can go in one run:

```bash
yarn upload-image photos/*.jpg
```

A file that fails is reported and the rest still upload.
The command exits with 1 if any file failed, so it can be used in other scripts.

## Options

| Option             | What it does                                                                                              |
| ------------------ | --------------------------------------------------------------------------------------------------------- |
| `--folder <name>`  | Puts the image in a folder: `--folder blog` uploads `diagram.png` as `blog/diagram`. Nested folders work. |
| `--id <public id>` | Sets the name yourself instead of taking it from the file name. Only with a single file.                  |

## How the name is chosen

Cloudinary calls an image's name its public id, and it becomes part of the URL.
The script makes it from the file name: lowercase, accents removed, and anything that is not a letter or a digit turned into a hyphen.

| File                         | Public id                |
| ---------------------------- | ------------------------ |
| `Diamond System Diagram.png` | `diamond-system-diagram` |
| `kulcsár_rudolf (1).jpg`     | `kulcsar-rudolf-1`       |

A file name with nothing usable in it (`___.png`) is refused; pass `--id` for that one.

## Nothing is overwritten

If the public id is already taken, the existing image is kept and the script prints:

```
! diagram.png: "diagram" already exists and was not replaced (4116x3895, 504 KB)
```

followed by the URL of the image that is already there, which may not be the file you just gave it.
To upload a changed version, give it a new name with `--id` (for example `diagram-v2`) and update the `src` in the Markdown.
A new name also means no browser or CDN keeps showing the old image from its cache.

To replace an image under the same name, delete it in the Cloudinary console first and upload again.

## When something goes wrong

| Message                             | Cause and fix                                                                                          |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `CLOUDINARY_URL is not set`         | The variable is missing. Follow [Setup](#setup).                                                       |
| `CLOUDINARY_URL must look like ...` | The value was copied wrong. It has to start with `cloudinary://` and hold both the key and the secret. |
| `Invalid Signature ...`             | The secret in `CLOUDINARY_URL` is wrong, or was regenerated in the console. Copy it again.             |
| `Stale request ...`                 | The computer's clock is more than an hour off. Signed requests carry the current time.                 |
| `no such file`                      | The path is wrong. Quote paths that contain spaces.                                                    |

## How it works

The script uses Cloudinary's [upload API](https://cloudinary.com/documentation/image_upload_api_reference) directly with `fetch`, so it adds no package to the project.
Each request is signed: the parameters are sorted, joined as `key=value&...`, the API secret is appended, and the result is hashed with SHA-1.
The secret itself is never sent.

The folder goes into the public id (`blog/diagram`) rather than Cloudinary's `folder` parameter, because accounts in dynamic folder mode leave that parameter out of the URL.

The code is split in two:

- [scripts/cloudinary.ts](../scripts/cloudinary.ts) has the pure parts: reading `CLOUDINARY_URL`, signing, naming, and building the delivery URL.
  [scripts/cloudinary.test.ts](../scripts/cloudinary.test.ts) covers them, including the worked signature example from Cloudinary's documentation.
- [scripts/upload-image.ts](../scripts/upload-image.ts) is the command: it reads the arguments and the environment, sends the requests and prints the results.
