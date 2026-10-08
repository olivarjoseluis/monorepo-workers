import { cors } from "hono/cors";
import type { MiddlewareHandler } from "hono";
import type { AppBindings, Env } from "../types.ts";

/** Orígenes permitidos si `CORS_ORIGINS` no está definido en el entorno. */
const DEFAULT_ORIGINS = ["http://localhost:5173", "http://localhost:4173"];

function allowedOrigins(env: Env): string[] {
  const configured = env.CORS_ORIGINS?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  return configured?.length ? configured : DEFAULT_ORIGINS;
}

/**
 * CORS como middleware propio en vez de `app.use(cors())` directo: la lista de
 * orígenes vive en `wrangler.jsonc` (`vars.CORS_ORIGINS`), y los `vars` sólo
 * existen en `env` durante la petición. Por eso se construye el middleware
 * dentro del handler, con el `env` ya disponible.
 */
export const corsMiddleware: MiddlewareHandler<AppBindings> = (c, next) => {
  const origins = allowedOrigins(c.env);

  return cors({
    origin: (origin) => {
      // `*` deja pasar cualquier origen (útil sólo en desarrollo).
      if (origins.includes("*")) return origin || "*";
      return origins.includes(origin) ? origin : null;
    },
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type"],
    maxAge: 86400,
  })(c, next);
};
