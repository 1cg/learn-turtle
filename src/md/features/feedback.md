# Feedback

## Intent

- A child, a parent or a teacher can send a short note about the site.
- The note goes to the maintainer. The site shows no account, no login and no tracking.
- The form is small. It does not get in the way of the lesson.

## Form

- A "Feedback" button sits in the page header.
- The button opens a dialog with:
  - a text box (required, at most 2000 characters),
  - a check box "Send my code too" (off by default),
  - an optional contact box (email or name, at most 200 characters),
  - "Send" and "Cancel".
- The dialog tells the reader: "Do not write your full name or address."
- After "Send", the dialog shows "Thank you!" or the error in plain words.
- All site code is in `js/feedback.js`. `index.html` loads it with one `<script>` line. It reads the code from the Monaco model, not from `js/app.js`.

## Endpoint

- A Cloudflare Worker in `feedback/` takes `POST /api/feedback` with JSON `{text, page, code?, contact?}`.
- On learnturtle.org, the page posts to `/api/feedback` on the same origin (a Worker route). There is no CORS for the public site.
- For local work, the page posts to `http://127.0.0.1:8787/api/feedback` (`wrangler dev`). The Worker allows CORS only for the local origins.

## Checks

- The body is at most 64 KB. `text` is 1 to 2000 characters, `code` at most 50000, `contact` at most 200, `page` at most 500.
- Other fields are dropped.
- A hidden `website` field catches simple bots. If it has text, the Worker answers 200 and stores nothing.
- Rate limit: 5 notes per minute for each IP address, with the Workers rate limit binding.
- Answers: 200 `{ok: true}`, 400 bad input, 405 wrong method, 413 too large, 429 too many.

## Storage

- The notes go to the D1 database `learn-turtle-feedback`, table `notes` (`feedback/schema.sql`). The human chose D1 (card-10).
- The Worker stores the note with the time and the country (`request.cf.country`). It does not store the IP address.
- There is no alert for a new note. Read the notes with `wrangler d1 execute` (see `feedback/README.md`) or in the dashboard.

## Subtleties

- The rate limit binding counts per Cloudflare location. It is approximate, not exact.
- A kid can paste personal data. The form warns, and the maintainer must delete such notes.
