#!/bin/sh
set -e

# node_modules is a Docker volume rather than part of the bind mount, because the
# host's copy is built for macOS and the container needs the Linux builds of
# @tailwindcss/oxide, lightningcss and rolldown.
#
# That volume is seeded from the image once, at creation, and then outlives every
# rebuild. So a upm.lock change would produce a new image whose dependencies the
# running container never sees, and the symptom is a missing module that survives
# `docker compose build`. Reconciling here closes that gap: it is a no-op when
# the volume already matches, and --frozen-lockfile turns a package.json that has
# drifted from upm.lock into a loud failure rather than a quiet one.
#
# --verify is what makes it a real repair. Without it upm trusts the record of
# its last install and reports the tree up to date even when it has been half
# deleted underneath, which is exactly the state a volume ends up in after an
# interrupted install.
upm install --frozen-lockfile --verify --prefer-offline

exec "$@"
