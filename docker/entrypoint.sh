#!/bin/sh
set -e

# node_modules is a Docker volume rather than part of the bind mount, because the
# host's copy is built for macOS and the container needs the Linux builds of
# @tailwindcss/oxide, lightningcss and rolldown.
#
# That volume is seeded from the image once, at creation, and then outlives every
# rebuild. So a yarn.lock change would produce a new image whose dependencies the
# running container never sees, and the symptom is a missing module that survives
# `docker compose build`. Reconciling here closes that gap: it is a one second
# no-op when the volume already matches, and --frozen-lockfile turns a package.json
# that has drifted from yarn.lock into a loud failure rather than a quiet one.
#
# --check-files is what makes it a real repair. Without it yarn trusts
# node_modules/.yarn-integrity and reports "Already up-to-date" even when the
# tree underneath has been half deleted, which is exactly the state a volume
# ends up in after an interrupted install.
yarn install --frozen-lockfile --check-files --prefer-offline --network-timeout 600000

exec "$@"
