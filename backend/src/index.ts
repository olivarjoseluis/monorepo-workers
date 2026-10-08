import { Hono } from "hono";
import { corsMiddleware } from "./middleware/cors.ts";
import { fail, ok } from "./lib/http.ts";
import { createWaitlistRepository, describeStorage } from "./repositories/index.ts";
import { WaitlistService } from "./services/waitlist.service.ts";
import type { AppBindings } from "./types.ts";

const app = new Hono<AppBindings>();

app.use("*", corsMiddleware);

app.get("/health", async (c) => {
  const service = new WaitlistService(createWaitlistRepository(c.env));

  return c.json(
    ok({
      status: "ok",
      service: "waitly-api",
      storage: describeStorage(c.env),
      subscribers: await service.total(),
      timestamp: new Date().toISOString(),
    }),
  );
});

app.post("/waitlist", async (c) => {
  let payload: unknown;

  try {
    payload = await c.req.json();
  } catch {
    return c.json(fail("invalid_json", "El cuerpo debe ser JSON válido."), 400);
  }

  const email = (payload as { email?: unknown } | null)?.email;
  const service = new WaitlistService(createWaitlistRepository(c.env));
  const result = await service.subscribe(email);

  if (result.status === "invalid") {
    return c.json(fail("invalid_email", result.message), 400);
  }

  return c.json(
    ok({
      email: result.entry.email,
      alreadySubscribed: result.status === "already_subscribed",
    }),
    result.status === "created" ? 201 : 200,
  );
});

app.notFound((c) => c.json(fail("not_found", "Ruta no encontrada."), 404));

app.onError((error, c) => {
  console.error("waitly-api error:", error);
  return c.json(fail("internal_error", "Algo salió mal. Inténtalo de nuevo."), 500);
});

export default app;
