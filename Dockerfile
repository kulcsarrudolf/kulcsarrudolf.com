# syntax=docker/dockerfile:1

# Same tag as Dockerfile.dev, so there is one Node version to bump. It tracks
# the 24 in .nvmrc and the "24.x" in engines.node. It also ships yarn 1.22, and
# that is enough: .yarnrc.yml points it at the release committed under
# .yarn/releases, so no package manager is installed here.
ARG NODE_IMAGE=node:24-bookworm-slim

# ---------------------------------------------------------------------------
# deps: node_modules and nothing else, so a source change reuses this layer.
# ---------------------------------------------------------------------------
FROM ${NODE_IMAGE} AS deps

# HUSKY=0 makes the postinstall a no-op, the same way CI does it. The install is
# a full one: devDependencies are where vite, tailwind and the TanStack Start
# plugin live, and a build without them fails as a missing-module error that
# looks nothing like its cause.
ENV HUSKY=0 \
    YARN_GLOBAL_FOLDER=/yarn

WORKDIR /app
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn/releases ./.yarn/releases

# The cache mount keeps the downloaded packages across builds, so changing one
# dependency does not re-download the rest. node_modules is copied out of the
# cache rather than linked to it, so it stays whole once the mount is gone.
RUN --mount=type=cache,target=/yarn,sharing=locked \
    yarn install --immutable

# ---------------------------------------------------------------------------
# build: vite build -> .output/. It starts from deps rather than copying
# node_modules out of it, because `yarn build` also needs the install state
# Yarn wrote next to it.
# ---------------------------------------------------------------------------
FROM deps AS build

# VITE_ values are inlined into the bundle by `vite build`, so they are build
# arguments rather than runtime environment: setting them on `docker run` does
# nothing. Neither is a secret. VITE_WEB3FORMS_ACCESS_KEY is shipped to the browser
# in the client bundle by design, which is also why it being visible in
# `docker history` costs nothing. A genuinely secret build-time value would need
# a BuildKit secret instead, and that reasoning would have to be redone.
#
# VITE_ENV stays empty by default. Setting it to "production" switches on Vercel
# Analytics (src/components/layout/SpeedInsights.tsx), which only makes sense when
# Vercel is actually serving the site.
ARG VITE_ENV=""
ARG VITE_WEB3FORMS_ACCESS_KEY=""
ENV VITE_ENV=${VITE_ENV} \
    VITE_WEB3FORMS_ACCESS_KEY=${VITE_WEB3FORMS_ACCESS_KEY}

# src/content must be here or the build throws: src/server/content.ts reads the
# markdown through import.meta.glob at build time and asserts the glob matched.
COPY . .

# Nitro has no Vercel environment to detect here, so it picks the node-server preset
# and writes a standalone .output/ that serves .output/public itself. No reverse
# proxy is needed in front of it.
RUN yarn build

# ---------------------------------------------------------------------------
# runtime: .output/ on a bare Node. No node_modules, no package manager.
# ---------------------------------------------------------------------------
FROM ${NODE_IMAGE} AS runtime

# The nitro node-server reads both of these. Without HOST it binds loopback and
# the published port reaches nothing.
ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3000

WORKDIR /app

# The whole server bundle imports nothing but node: builtins, so this is the
# entire application.
COPY --from=build --chown=node:node /app/.output ./.output

USER node
EXPOSE 3000

# Rendering the home page rather than fetching a static file, because every page
# here is server-rendered at request time: a static hit would still pass while SSR
# was broken. One render every 30s is nothing for a site this size.
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
    CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/').then((r) => process.exit(r.ok ? 0 : 1), () => process.exit(1))"

# The same entry point as `yarn start`. Run with --init (or init: true in compose)
# so signals reach it and zombies get reaped.
CMD ["node", ".output/server/index.mjs"]
