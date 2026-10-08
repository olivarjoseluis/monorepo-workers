import { validateEmail } from "../lib/validation.ts";
import type { WaitlistEntry, WaitlistRepository } from "../repositories/index.ts";

export type SubscribeResult =
  | { status: "created"; entry: WaitlistEntry }
  | { status: "already_subscribed"; entry: WaitlistEntry }
  | { status: "invalid"; message: string };

/**
 * Reglas de negocio de la waitlist. No sabe nada de HTTP ni de la base de
 * datos: recibe un repositorio por constructor y devuelve resultados tipados
 * que la capa de rutas traduce a códigos de estado.
 */
export class WaitlistService {
  readonly #repository: WaitlistRepository;

  constructor(repository: WaitlistRepository) {
    this.#repository = repository;
  }

  async subscribe(email: unknown): Promise<SubscribeResult> {
    const validation = validateEmail(email);

    if (!validation.valid) {
      return { status: "invalid", message: validation.message };
    }

    const existing = await this.#repository.findByEmail(validation.value);

    if (existing) {
      // Reinscribirse no es un error: para el usuario el resultado es el mismo
      // (está en la lista), así que lo tratamos como éxito idempotente.
      return { status: "already_subscribed", entry: existing };
    }

    const entry = await this.#repository.create(validation.value);
    return { status: "created", entry };
  }

  async total(): Promise<number> {
    return this.#repository.count();
  }
}
