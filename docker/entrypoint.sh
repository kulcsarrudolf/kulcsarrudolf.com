#!/bin/sh
set -e

# node_modules is a Docker volume rather than part of the bind mount, because the
# host's copy is built for macOS and the container needs the Linux builds of
# @tailwindcss/oxide, lightningcss and rolldown.
#
# That volume is seeded from the image once, at creation, and then outlives every
# rebuild. So a yarn.lock change would produce a new image whose dependencies the
# running container never sees, and the symptom is a missing module that survives
# `docker compose build`. Reconciling here closes that gap: it is a sub-second
# no-op when the volume already matches, and --immutable turns a package.json
# that has drifted from yarn.lock into a loud failure rather than a quiet one.
#
# It is a real repair, not a check of the lockfile alone: Yarn keeps a record of
# the tree it laid out in node_modules/.yarn-state.yml, in the volume itself, and
# puts back whatever has gone missing underneath it, which is exactly the state a
# volume ends up in after an interrupted install.
yarn install --immutable

exec "$@"
