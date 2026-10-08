/**
 * Cliente del worker `waitly-api`.
 *
 * La URL base viene de `VITE_API_URL` (ver `.env.example`). Si no está
 * definida se asume el puerto por defecto de `wrangler dev`, para que el
 * proyecto funcione recién clonado sin configurar nada.
 */
const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8787";

type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: { code: string; message: string } };

export interface SubscribeData {
  email: string;
  alreadySubscribed: boolean;
}

/** Error con un mensaje ya listo para mostrarse al usuario. */
export class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApiError";
  }
}

export async function subscribeToWaitlist(
  email: string,
): Promise<SubscribeData> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}/waitlist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
  } catch {
    // fetch sólo rechaza por red/CORS; el backend caído entra por aquí.
    throw new ApiError(
      "No pudimos conectar con el servidor. Revisa que el backend esté corriendo.",
    );
  }

  let body: ApiResponse<SubscribeData>;

  try {
    body = (await response.json()) as ApiResponse<SubscribeData>;
  } catch {
    throw new ApiError("El servidor respondió algo inesperado.");
  }

  if (!body.success) {
    throw new ApiError(body.error.message);
  }

  return body.data;
}
