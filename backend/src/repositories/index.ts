import type { Env } from "../types.ts";
import { D1WaitlistRepository } from "./d1-waitlist.repository.ts";
import { MemoryWaitlistRepository } from "./memory-waitlist.repository.ts";
import type { WaitlistRepository } from "./waitlist.repository.ts";

export type { WaitlistEntry, WaitlistRepository } from "./waitlist.repository.ts";
export { D1WaitlistRepository } from "./d1-waitlist.repository.ts";
export { MemoryWaitlistRepository } from "./memory-waitlist.repository.ts";

/**
 * Único punto donde se decide qué almacenamiento usa la app.
 *
 * Hoy devuelve el mock; en cuanto exista el binding `DB` devuelve D1. Nada más
 * en el código necesita enterarse del cambio.
 */
export function createWaitlistRepository(env: Env): WaitlistRepository {
  if (env.DB) {
    return new D1WaitlistRepository(env.DB);
  }

  return new MemoryWaitlistRepository();
}

/** Nombre del backend activo — lo reporta `/health`. */
export function describeStorage(env: Env): "d1" | "memory" {
  return env.DB ? "d1" : "memory";
}
