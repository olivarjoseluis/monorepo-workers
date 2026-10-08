import type {
  WaitlistEntry,
  WaitlistRepository,
} from "./waitlist.repository.ts";

/**
 * Implementación mock mientras no hay base de datos.
 *
 * Vive en el módulo (no en la instancia) para que los datos sobrevivan entre
 * peticiones del mismo isolate durante `wrangler dev`. Aun así es volátil: se
 * pierde al reiniciar o al cambiar de isolate. Es exactamente lo que se espera
 * de un mock, y la razón por la que existe el repositorio D1.
 */
const entries = new Map<string, WaitlistEntry>();

export class MemoryWaitlistRepository implements WaitlistRepository {
  async findByEmail(email: string): Promise<WaitlistEntry | null> {
    return entries.get(email) ?? null;
  }

  async create(email: string): Promise<WaitlistEntry> {
    const entry: WaitlistEntry = {
      id: crypto.randomUUID(),
      email,
      createdAt: new Date().toISOString(),
    };

    entries.set(email, entry);
    return entry;
  }

  async count(): Promise<number> {
    return entries.size;
  }
}
