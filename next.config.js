/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow a separate build directory per running instance so that two
  // concurrent `next dev` processes (e.g. your local server and a
  // preview/verification server) never clobber each other's chunks.
  distDir: process.env.NEXT_DIST_DIR || ".next",

  // Serve the wedding countdown page (/nr) under a few friendlier aliases.
  // Rewrites keep the URL the visitor typed while rendering the same page,
  // and query params (e.g. ?lang=ro) are forwarded automatically.
  async rewrites() {
    return [
      { source: "/rn", destination: "/nr" },
      { source: "/rudolf-es-nora", destination: "/nr" },
      { source: "/rudolf-and-nora", destination: "/nr" },
    ];
  },
};

module.exports = nextConfig;
