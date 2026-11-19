#!/bin/sh
# Deploy by hand. A push to master deploys too (Workers Builds). See src/md/infrastructure/hosting.md.
set -eu

FILES="index.html css js py lessons deploy/_headers"
cd "$(git rev-parse --show-toplevel)"

if [ -n "$(git status --porcelain -- $FILES)" ]; then
  echo "Deploy failed: the site files have uncommitted changes. Commit them, then run again." >&2
  exit 1
fi

sh deploy/build.sh
npx -y wrangler@4.150.0 deploy
