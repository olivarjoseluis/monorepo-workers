# waitly-api

Worker de Cloudflare con Hono. Ver el [README de la raíz](../README.md) para la
documentación completa de la API y los pasos para activar D1.

```bash
npm run dev      # http://localhost:8787
npm run build    # type-check
npm run deploy
```

| Capa                  | Responsabilidad                                        |
| --------------------- | ------------------------------------------------------ |
| `src/index.ts`        | Rutas Hono; traduce HTTP ↔ servicio                    |
| `src/middleware/`     | CORS configurable por `vars.CORS_ORIGINS`              |
| `src/services/`       | Reglas de negocio, sin HTTP ni SQL                     |
| `src/repositories/`   | Puerto `WaitlistRepository` + mock en memoria + D1     |
| `src/lib/`            | Validación de email y forma de las respuestas JSON     |
