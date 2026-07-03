/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow a separate build directory per running instance so that two
  // concurrent `next dev` processes (e.g. your local server and a
  // preview/verification server) never clobber each other's chunks.
  distDir: process.env.NEXT_DIST_DIR || ".next",
};

module.exports = nextConfig;
