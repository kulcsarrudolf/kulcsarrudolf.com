#!/usr/bin/env bash
# Deploy develop to master.
# Flow: checkout master, sync with remote, fast-forward to develop, push, back to develop.

set -euo pipefail

if [ -n "$(git status --porcelain)" ]; then
  echo "Working tree is not clean. Commit or stash first."
  exit 1
fi

echo "→ Fetching latest from origin"
git fetch origin

echo "→ Switching to master"
git checkout master

echo "→ Aligning local master with origin/master"
git reset --hard origin/master

echo "→ Fast-forwarding master to develop"
git merge --ff-only develop

echo "→ Pushing master"
git push origin master

echo "→ Switching back to develop"
git checkout develop

echo ""
echo "Deployed develop → master."
