#!/bin/sh
# Deploy the site to Cloudflare Pages. See src/md/infrastructure/hosting.md.
set -eu

PROJECT=learn-turtle
WRANGLER=wrangler@4.150.0
FILES="index.html css js py"

cd "$(git rev-parse --show-toplevel)"

if [ -n "$(git status --porcelain -- $FILES)" ]; then
  echo "Deploy failed: the site files have uncommitted changes. Commit them, then run again." >&2
  exit 1
fi

rm -rf tmp/site
mkdir -p tmp/site
git archive HEAD $FILES | tar -x -C tmp/site
cp deploy/_headers tmp/site/_headers

npx -y "$WRANGLER" pages deploy tmp/site \
  --project-name "$PROJECT" \
  --branch main \
  --commit-hash "$(git rev-parse HEAD)" \
  --commit-message "$(git log -1 --format=%s)"
