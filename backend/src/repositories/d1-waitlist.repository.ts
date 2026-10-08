import type {
  WaitlistEntry,
  WaitlistRepository,
} from "./waitlist.repository.ts";

interface WaitlistRow {
  id: string;
  email: string;
  created_at: string;
}

/**
 * Implementación D1, lista para usarse.
 *
 * Todavía no está activa porque `wrangler.jsonc` no declara el binding `DB`.
 * Para encenderla: descomenta el bloque `d1_databases`, corre la migración de
 * `migrations/0001_create_waitlist.sql` y listo — la fábrica la elige sola.
 */
export class D1WaitlistRepository implements WaitlistRepository {
  readonly #db: D1Database;

  constructor(db: D1Database) {
    this.#db = db;
  }

  async findByEmail(email: string): Promise<WaitlistEntry | null> {
    const row = await this.#db
      .prepare("SELECT id, email, created_at FROM waitlist WHERE email = ?")
      .bind(email)
      .first<WaitlistRow>();

    return row ? toEntry(row) : null;
  }

  async create(email: string): Promise<WaitlistEntry> {
    const row = await this.#db
      .prepare(
        "INSERT INTO waitlist (id, email, created_at) VALUES (?, ?, ?) RETURNING id, email, created_at",
      )
      .bind(crypto.randomUUID(), email, new Date().toISOString())
      .first<WaitlistRow>();

    if (!row) {
      throw new Error("No se pudo insertar el email en la waitlist.");
    }

    return toEntry(row);
  }

  async count(): Promise<number> {
    const row = await this.#db
      .prepare("SELECT COUNT(*) AS total FROM waitlist")
      .first<{ total: number }>();

    return row?.total ?? 0;
  }
}

function toEntry(row: WaitlistRow): WaitlistEntry {
  return { id: row.id, email: row.email, createdAt: row.created_at };
}
