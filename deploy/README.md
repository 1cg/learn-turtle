# Deploy

Intent and details: `src/md/infrastructure/hosting.md`.

## One-time setup (human)

1. Log in to https://dash.cloudflare.com.
2. Make an API token: My Profile > API Tokens > Create Token > Custom token.
3. Give it one permission: Account > Cloudflare Pages > Edit. Limit it to your account.
4. Give the token and the account ID to the agent through Mr Klanky (`CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`).
5. Make the project once: `npx -y wrangler@4.150.0 pages project create learn-turtle --production-branch main --force`.
   Without `--force`, wrangler tries to make a Workers project and fails. Use `--force` only for this one command.
6. Set Browser Cache TTL to "Respect Existing Headers": https://dash.cloudflare.com/?to=/:account/learnturtle.org/caching/configuration

## Each deploy

1. Commit the site files.
2. Run `deploy/deploy.sh`.
3. Open https://learn-turtle.pages.dev and run a program.

## Custom domain (after card-8)

1. Open Workers & Pages > learn-turtle > Custom domains > Set up a custom domain.
2. Type `learnturtle.org`. Accept the DNS record that Cloudflare adds.
3. Do step 1 and 2 again for `www.learnturtle.org`.
4. Wait for the status "Active". Cloudflare issues the HTTPS certificate.
5. Open https://learnturtle.org and run a program.
