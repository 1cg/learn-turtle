# Deploy

Intent and details: `src/md/infrastructure/hosting.md`.

## Normal deploy

Push `master` to https://github.com/1cg/learn-turtle. Cloudflare Workers Builds builds and deploys the Worker `learn-turtle`.

## By hand

1. Commit the site files.
2. Run `deploy/deploy.sh` (needs `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`).

## Workers Builds settings (one time, human)

- Open https://dash.cloudflare.com/?to=/:account/workers/services/view/learn-turtle/production/settings and find Build.
- Connect the GitHub repo `1cg/learn-turtle`, branch `master`.
- Build command: `sh deploy/build.sh`. Deploy command: `npx wrangler deploy`. Root directory: `/`.

## Zone setting (one time)

Browser Cache TTL must be "Respect Existing Headers": https://dash.cloudflare.com/?to=/:account/learnturtle.org/caching/configuration

## Old Pages project

The Pages project `learn-turtle` (direct upload) gets no traffic after the Worker routes are live. Keep it until the Worker is proven, then delete it.
