# Hosting

## Intent

- The public site is https://learnturtle.org, with HTTPS, on a Cloudflare Worker with static assets (Worker `learn-turtle`).
- A push to `master` on GitHub (https://github.com/1cg/learn-turtle, public) deploys the site. Cloudflare Workers Builds does it.
- The site has no build step of its own. The site files are `index.html`, `css/`, `js/`, `py/` and `lessons/`.
- Only these files go to the server. Docs, tests, tools, `tmp/` and agent files stay out.

## Deploy

On each push to `master`, Workers Builds:

1. runs the build command `sh deploy/build.sh`: it copies the site files and `deploy/_headers` into `dist/`,
2. runs the deploy command `npx wrangler deploy`: it reads `wrangler.toml` and uploads `dist/`.

By hand (for example, if Workers Builds is down): `deploy/deploy.sh`. It needs a clean checkout of the site files, then runs the same build and `wrangler deploy` with wrangler 4.150.0.

## Routes

- The Worker has the routes `learnturtle.org/*` and `www.learnturtle.org/*`.
- The feedback Worker has `learnturtle.org/api/feedback` and the same on www. The more specific route wins, so feedback still goes to its own Worker.
- The DNS records stay: proxied CNAMEs to `learn-turtle.pages.dev`. A route runs before the request goes to that target, so the old Pages project gets no traffic. To roll back, remove the two routes.

## Subtleties

- Cloudflare cannot connect a direct-upload Pages project to Git, so card-28 made a new Worker. Cloudflare now says "Start new projects with Workers".
- `_headers` must be at the root of `dist/`. Workers static assets read it there.
- The browser must check each file again (`max-age=0`), so a new deploy shows at the next load. Check: `curl -sI https://learnturtle.org/js/app.js`.
- The zone setting Browser Cache TTL must be "Respect Existing Headers". With the default (4 h), the browser keeps old JS with a new `index.html`, and the page breaks (card-15).
- The site has no CSP yet. Monaco and Pyodide load from cdn.jsdelivr.net and make workers. A CSP needs a test in the browser first.
- After a lesson change, run `python3 tools/make_thumbs.py` before the commit (see `src/md/features/home.md`).
