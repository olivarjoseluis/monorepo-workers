# waitly-web

Vite + React + TypeScript, desplegado como Worker de assets estáticos.
Config heredada de `example-1` (`vite.config.ts`, `tsconfig.*`, `.oxlintrc.json`).

```bash
cp .env.example .env   # opcional: por defecto apunta a http://localhost:8787
npm run dev            # http://localhost:5173
npm run build
npm run deploy
```

La página única vive en `src/components/WaitlistPage.tsx` y maneja cuatro
estados: `idle`, `loading`, `success` y `error`. Las llamadas al backend están
aisladas en `src/lib/api.ts`.
