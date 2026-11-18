# Feedback Worker

Intent: `src/md/features/feedback.md`.

## Test

- `node feedback/test.mjs` tests the checks, the rate limit and CORS.

## Deploy

1. Put `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` in the env through Mr Klanky.
2. One time: `cd feedback && npx -y wrangler@4.150.0 d1 execute learn-turtle-feedback --remote --file schema.sql`.
3. Run `cd feedback && npx -y wrangler@4.150.0 deploy`.
4. Send a note from https://learnturtle.org with the Feedback button.

## Read the notes

- `cd feedback && npx -y wrangler@4.150.0 d1 execute learn-turtle-feedback --remote --command "SELECT id, time, page, text, contact FROM notes ORDER BY id DESC LIMIT 20"`
- Delete a note: `... --command "DELETE FROM notes WHERE id = 7"`.

## Notes

- The routes in `wrangler.toml` need learnturtle.org in the same Cloudflare account.
- `wrangler dev` 4.150.0 fails on Node 26 (`ERR_IPC_CHANNEL_CLOSED`). The unit test calls the Worker directly.
