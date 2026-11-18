# Hosting

## Intent

- The public site is https://learnturtle.org on Cloudflare Pages, with HTTPS.
- The site has no build step. The site files are `index.html`, `css/`, `js/` and `py/`.
- Only these files go to the server. Docs, tests, `tmp/` and agent files stay local.
- One command deploys the site: `deploy/deploy.sh`.

## Deploy

1. `deploy/deploy.sh` copies the committed site files from `HEAD` into `tmp/site/` with `git archive`.
2. It adds `deploy/_headers` to `tmp/site/`.
3. It runs `wrangler pages deploy tmp/site --project-name learn-turtle --branch main`.

- Wrangler is pinned to 4.150.0 and runs with `npx`. The project installs no Node packages.
- Wrangler gets its login from `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`, or from `wrangler login`.
- The token needs the permission "Account > Cloudflare Pages > Edit". Nothing more.

## Subtleties

- The deploy uses direct upload, not Git integration. The repo has no remote.
- Uncommitted changes do not deploy. Commit first. The script stops if the site files have changes.
- `_headers` must be at the root of the uploaded folder. Cloudflare reads it there.
- Pages sets an ETag on each file. The browser checks it again, so a new deploy shows at the next load. `_headers` does not change caching.
- The site has no CSP yet. Monaco and Pyodide load from cdn.jsdelivr.net and make workers. A CSP needs a test in the browser first.
- The custom domain needs the domain in the same Cloudflare account (card-8).
