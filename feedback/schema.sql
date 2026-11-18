-- Feedback notes. Intent: src/md/features/feedback.md
CREATE TABLE IF NOT EXISTS notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  time TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT '',
  page TEXT,
  text TEXT NOT NULL,
  code TEXT,
  contact TEXT
);
