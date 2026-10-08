/**
 * Contrato de persistencia de la waitlist.
 *
 * El servicio sólo conoce esta interfaz, nunca una base de datos concreta.
 * Añadir D1 (o KV, o Postgres) es escribir otra implementación de este puerto
 * y registrarla en la fábrica — sin tocar rutas ni reglas de negocio.
 */
export interface WaitlistEntry {
  id: string;
  email: string;
  createdAt: string;
}

export interface WaitlistRepository {
  /** Devuelve la entrada si el email ya está inscrito, o `null`. */
  findByEmail(email: string): Promise<WaitlistEntry | null>;
  /** Inserta un email ya validado y normalizado. */
  create(email: string): Promise<WaitlistEntry>;
  /** Total de inscritos — usado por `/health` y futuras métricas. */
  count(): Promise<number>;
}
