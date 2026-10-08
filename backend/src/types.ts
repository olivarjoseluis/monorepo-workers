/**
 * Bindings y variables de entorno del Worker.
 *
 * `DB` es opcional a propósito: hoy no hay base de datos y el Worker corre con
 * el repositorio en memoria. Cuando se añada el binding D1 en `wrangler.jsonc`,
 * la fábrica de repositorios lo detecta y cambia de implementación sin tocar
 * ni las rutas ni el servicio.
 */
export interface Env {
  /** Orígenes permitidos por CORS, separados por coma. */
  CORS_ORIGINS?: string;
  /** Binding de D1. Aún sin configurar — ver el bloque comentado en wrangler.jsonc. */
  DB?: D1Database;
}

/** Tipos del contexto de Hono compartidos por toda la app. */
export type AppBindings = {
  Bindings: Env;
};
