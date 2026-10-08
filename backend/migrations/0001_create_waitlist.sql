-- Migración inicial de la waitlist.
-- Aplicar cuando se active el binding D1 en wrangler.jsonc:
--   npx wrangler d1 execute waitly-db --local --file=./migrations/0001_create_waitlist.sql
--   npx wrangler d1 execute waitly-db --remote --file=./migrations/0001_create_waitlist.sql

CREATE TABLE IF NOT EXISTS waitlist (
  id         TEXT PRIMARY KEY,
  email      TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist (created_at);
