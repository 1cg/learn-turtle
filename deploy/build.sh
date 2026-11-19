#!/bin/sh
# Copy the site files into dist/ for the Worker. See src/md/infrastructure/hosting.md.
set -eu
cd "$(dirname "$0")/.."
rm -rf dist
mkdir -p dist
cp -R index.html css js py lessons dist/
cp deploy/_headers dist/_headers
echo "dist: $(find dist -type f | wc -l | tr -d ' ') files"
