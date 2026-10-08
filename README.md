# Waitly

Monorepo de una lista de espera, construido para el curso de **Cloudflare Workers de Platzi**.

```
waitly/
├── frontend/   # Vite + React + TypeScript → Worker de assets estáticos (waitly-web)
└── backend/    # Hono → Worker de API (waitly-api)
```

## Arranque

```bash
npm install          # instala ambos workspaces desde la raíz
npm run dev          # backend (:8787) y frontend (:5173) en paralelo
```

Scripts de la raíz:

| Script                 | Qué hace                                      |
| ---------------------- | --------------------------------------------- |
| `npm run dev`          | Levanta backend y frontend a la vez           |
| `npm run dev:backend`  | Sólo `waitly-api` en http://localhost:8787    |
| `npm run dev:frontend` | Sólo `waitly-web` en http://localhost:5173    |
| `npm run build`        | Compila ambos proyectos                       |
| `npm run lint`         | oxlint en ambos proyectos                     |
| `npm run deploy`       | Despliega ambos Workers                       |

## API

Base: `http://localhost:8787`

### `GET /health`

```json
{
  "success": true,
  "data": {
    "status": "ok",
    "service": "waitly-api",
    "storage": "memory",
    "subscribers": 3,
    "timestamp": "2026-10-08T02:36:25.558Z"
  }
}
```

### `POST /waitlist`

Body: `{ "email": "tu@email.com" }`

| Situación                | Código | Respuesta                                                        |
| ------------------------ | ------ | ---------------------------------------------------------------- |
| Email nuevo              | `201`  | `{ success: true, data: { email, alreadySubscribed: false } }`   |
| Email ya inscrito        | `200`  | `{ success: true, data: { email, alreadySubscribed: true } }`    |
| Email inválido o ausente | `400`  | `{ success: false, error: { code: "invalid_email", message } }`  |
| JSON malformado          | `400`  | `{ success: false, error: { code: "invalid_json", message } }`   |

El email se normaliza (recorte de espacios + minúsculas) antes de guardarse, y
reinscribirse se trata como éxito idempotente en vez de como error.

## Arquitectura del backend

```
src/
├── index.ts                 # rutas Hono — sólo traduce HTTP ↔ servicio
├── middleware/cors.ts       # CORS leyendo orígenes de vars.CORS_ORIGINS
├── services/                # reglas de negocio (no sabe de HTTP ni de DB)
├── repositories/            # puerto de persistencia + implementaciones
└── lib/                     # validación y forma de las respuestas
```

El servicio depende de la interfaz `WaitlistRepository`, nunca de una base de
datos concreta. `repositories/index.ts` es el único sitio que decide la
implementación.

## Añadir D1

Todo está listo; faltan tres pasos:

1. `npx wrangler d1 create waitly-db` dentro de `backend/`.
2. Descomentar el bloque `d1_databases` de `backend/wrangler.jsonc` y pegar el
   `database_id` que devolvió el comando.
3. Aplicar la migración:
   ```bash
   npx wrangler d1 execute waitly-db --local  --file=./migrations/0001_create_waitlist.sql
   npx wrangler d1 execute waitly-db --remote --file=./migrations/0001_create_waitlist.sql
   ```

En cuanto el binding `DB` existe, la fábrica devuelve `D1WaitlistRepository`
—ya implementado— en vez del mock en memoria. No hay que tocar rutas ni
servicio; `GET /health` pasará a reportar `"storage": "d1"`.

## Configuración

| Dónde                    | Variable       | Para qué                                    |
| ------------------------ | -------------- | ------------------------------------------- |
| `backend/wrangler.jsonc` | `CORS_ORIGINS` | Orígenes permitidos, separados por coma     |
| `frontend/.env`          | `VITE_API_URL` | URL del backend (por defecto `:8787`)       |

Al desplegar, actualiza `CORS_ORIGINS` con el dominio real de `waitly-web` y
`VITE_API_URL` con el de `waitly-api`.

## Notas

- El almacenamiento en memoria es volátil: se pierde al reiniciar el Worker.
  Es intencional — es el mock previo a D1.
- El frontend se despliega como Worker de **sólo assets** (sin `main`), con
  `not_found_handling: "single-page-application"`.
